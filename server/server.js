import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import fetch from 'node-fetch'
import gtts from 'node-gtts'

const app = express()
app.use(cors())
app.use(express.json())

// Ensure uploads directory exists and use absolute path
const uploadDir = path.join(process.cwd(), 'uploads')
try { fs.mkdirSync(uploadDir, { recursive: true }) } catch {}
const upload = multer({ dest: uploadDir })

// ======== FILE UPLOAD / OCR / PDF READER =========
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const filePath = path.resolve(req.file.path)
    const ext = path.extname(req.file.originalname || '').toLowerCase()

    if (ext === '.txt') {
      // Read plain text and return
      const content = fs.readFileSync(filePath, 'utf8')
      try { fs.unlinkSync(filePath) } catch {}
      return res.json({ text: content })
    }

    const serverCwd = process.cwd()
    const runPy = (script, args) => new Promise((resolve, reject) => {
      // First try 'python', then fall back to 'py' (Windows launcher)
      execFile('python', [script, ...args], { cwd: serverCwd }, (err, stdout, stderr) => {
        if (!err) return resolve(String(stdout || '').trim())
        execFile('py', ['-3', script, ...args], { cwd: serverCwd }, (err2, stdout2, stderr2) => {
          if (!err2) return resolve(String(stdout2 || '').trim())
          return reject(stderr2 || stderr || err2?.message || err?.message)
        })
      })
    })

    const doWork = async () => {
      try {
        let out = ''
        if (ext === '.pdf') {
          out = await runPy('pdf_reader.py', [filePath])
        } else {
          // default to OCR for images and unknowns
          out = await runPy('ocr.py', [filePath])
        }
        return res.json({ text: out })
      } catch (e) {
        return res.status(500).json({ error: 'Extraction failed', detail: String(e) })
      } finally {
        try { fs.unlinkSync(filePath) } catch {}
      }
    }
    doWork()
  } catch (e) {
    res.status(500).json({ error: 'Upload handling failed', detail: e.message })
  }
})

// ======== TRANSLATION =========
app.post('/translate', async (req, res) => {
  const { text, to, mode } = req.body
  const simplify = (s) => {
    if (!s) return s
    // 1) Normalize whitespace and keep line breaks if present
    let t = s.replace(/\r\n?/g, '\n').replace(/[\t ]+/g, ' ').replace(/[ \u00A0]+\n/g, '\n').trim()

    // 2) Expand a simple domain glossary (education/platform terms)
    const glossary = {
      'utilize': 'use',
      'commence': 'start',
      'terminate': 'end',
      'facilitate': 'help',
      'approximately': 'about',
      'assistance': 'help',
      'inquire': 'ask',
      'enrollment': 'join',
      'enrolment': 'join',
      'authentication': 'login',
      'authorization': 'access',
      'preferences': 'settings',
      'profile': 'account',
      'instructor': 'teacher',
      'instructors': 'teachers',
      'lectures': 'lessons',
      'modules': 'units',
      'assignments': 'homework',
      'quizzes': 'tests',
      'assessments': 'tests',
      'discussion forums': 'discussion boards',
      'direct messaging': 'chat',
      'messaging': 'chat',
      'recommendations': 'suggestions',
      'learning paths': 'learning plans',
      'analytics': 'stats',
      'moderation': 'review',
      'approval workflows': 'approval steps',
      'quality control': 'quality checks',
      'inappropriate': 'not allowed',
      'flagged': 'reported',
      'dashboard': 'home',
      'permissions': 'access',
      'wishlist': 'saved list',
      'bookmarking': 'saving',
      'progress tracking': 'track progress',
      'certifications': 'certificates',
      'certification': 'certificate',
      'achievements': 'badges',
      'engagement': 'activity',
      'platform': 'site'
    }
    // Replace multi-word keys first by sorting by length
    const keys = Object.keys(glossary).sort((a,b)=>b.length-a.length)
    keys.forEach(k => {
      const re = new RegExp(`\\b${k.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')}\\b`, 'gi')
      t = t.replace(re, (m)=>{
        // preserve capitalization for sentence start
        const rep = glossary[k]
        return m[0] === m[0].toUpperCase() ? rep.charAt(0).toUpperCase()+rep.slice(1) : rep
      })
    })

    // 3) Convert numbered lists and dashes to bullets
    // e.g., "1. Item" or "- Item" to separate lines with a hyphen
    t = t.replace(/\s*\d+\)\s+/g, '\n- ').replace(/\s*\d+\.\s+/g, '\n- ').replace(/\s*[•·]\s+/g, '\n- ')
    // ensure spaced dashes become bullets on new lines
    t = t.replace(/\s-\s/g, ' - ')

    // 4) Split long sentences into shorter lines
    const out = []
    t.split(/\n+/).forEach(line => {
      if (!line.trim()) return
      // Further split on punctuation boundaries into shorter chunks
      const chunks = line.split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      chunks.forEach(ch => {
        if (ch.split(' ').length > 24) {
          // If very long, split at commas
          ch.split(/,\s*/).forEach((part, i) => out.push((i?'- ':'' ) + part.trim()))
        } else {
          out.push(ch.trim())
        }
      })
    })
    return out.join('\n')
  }
  const source = mode === 'friendly' ? simplify(text) : text
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(source)}`
  const result = await fetch(url).then(r => r.json())
  res.json({ translated: result[0].map(p => p[0]).join('') })
})

// ======== GLOSSARY (word-level tooltip support) =========
const glossCache = new Map() // key: `${lang}:${token}` -> english gloss
app.post('/glossary', async (req, res) => {
  try {
    const { tokens = [], lang } = req.body || {}
    if (!Array.isArray(tokens) || !lang) return res.status(400).json({ error: 'tokens and lang required' })
    const unique = Array.from(new Set(tokens.filter(t => typeof t === 'string' && t.trim()).slice(0, 300)))
    const out = {}
    await Promise.all(unique.map(async (t) => {
      const key = `${lang}:${t}`
      if (glossCache.has(key)) { out[t] = glossCache.get(key); return }
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(lang)}&tl=en&dt=t&q=${encodeURIComponent(t)}`
        const data = await fetch(url).then(r => r.json())
        const eng = data?.[0]?.[0]?.[0] || ''
        if (eng) {
          glossCache.set(key, eng)
          out[t] = eng
        }
      } catch (e) {
        // ignore individual failures
      }
    }))
    res.json({ map: out, count: Object.keys(out).length })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Translate a list of tokens (words) to English for tooltips
app.post('/translateTokens', async (req, res) => {
  try {
    const { tokens = [], from = 'auto', to = 'en' } = req.body || {}
    if (!Array.isArray(tokens) || tokens.length === 0) return res.json({ map: {} })
    const uniq = Array.from(new Set(tokens.filter(t => typeof t === 'string' && t.trim())))
    const base = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t`
    // Attempt batch via newline join
    const joined = uniq.join('\n')
    const url = `${base}&q=${encodeURIComponent(joined)}`
    const result = await fetch(url).then(r => r.json())
    const combined = (result && result[0]) ? result[0].map(p => p[0]).join('') : ''
    let parts = combined.split('\n')
    let map = {}
    if (parts.length === uniq.length) {
      uniq.forEach((tok, i) => { map[tok] = parts[i] })
    } else {
      // Fallback: translate individually (slower but robust)
      map = {}
      for (const tok of uniq) {
        const u = `${base}&q=${encodeURIComponent(tok)}`
        try {
          const r = await fetch(u).then(r => r.json())
          const gloss = (r && r[0]) ? r[0].map(p => p[0]).join('') : tok
          map[tok] = gloss
        } catch {
          map[tok] = tok
        }
      }
    }
    res.json({ map })
  } catch (e) {
    console.error('translateTokens error', e)
    res.status(500).json({ error: 'translateTokens failed' })
  }
})

// ======== TTS with gTTS =========
app.post('/tts', (req, res) => {
  const { text, lang } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const tts = gtts(lang || 'ta'); // default Tamil
    const outPath = path.join(process.cwd(), 'tts.mp3');

    tts.save(outPath, text, () => {
      res.sendFile(outPath, (err) => {
        if (err) {
          console.error('Send file error:', err);
        }
        // delete temp file after sending
        fs.unlink(outPath, () => {});
      });
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});


// ======== START SERVER =========
app.listen(5000, () => console.log('Server running on port 5000'))
