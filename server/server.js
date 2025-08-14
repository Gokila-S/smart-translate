import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import fetch from 'node-fetch'
import gtts from 'node-gtts'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import historyRoutes from './routes/history.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

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
      const content = fs.readFileSync(filePath, 'utf8')
      try { fs.unlinkSync(filePath) } catch {}
      return res.json({ text: content })
    }

    const serverCwd = process.cwd()
    const runPy = (script, args) => new Promise((resolve, reject) => {
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

// ======== TEXT SUMMARIZATION =========
app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  const tempFilePath = path.join(process.cwd(), 'temp_summary.txt');
  fs.writeFileSync(tempFilePath, text, 'utf8');

  const runPy = (script, args) => new Promise((resolve, reject) => {
    execFile('python', [script, ...args], { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (stderr) {
        console.error('Python script error (stderr):', stderr);
      }
      if (!err) return resolve(String(stdout || '').trim());
      
      // Fallback for Windows
      execFile('py', ['-3', script, ...args], { cwd: process.cwd() }, (err2, stdout2, stderr2) => {
        if (stderr2) {
          console.error('Python script error (fallback stderr):', stderr2);
        }
        if (!err2) return resolve(String(stdout2 || '').trim());
        return reject(stderr2 || stderr || err2?.message || err?.message);
      });
    });
  });

  try {
    console.log('Attempting to summarize...');
    let out = '';
    let result;
    try {
      out = await runPy('summarizer.py', [tempFilePath]);
      console.log('Python script output:', out);
      result = JSON.parse(out);
    } catch (e) {
      console.warn('Python summarize failed or returned invalid JSON. Falling back.', e);
      result = null;
    }

    if (!result || result.error) {
      // Node fallback: simple sentence-based summary (first 3 sentences)
      const parts = String(text).trim().split(/(?<=[.!?])\s+/).filter(Boolean);
      const fallback = parts.slice(0, Math.max(1, Math.min(3, parts.length))).join(' ');
      return res.json({ summary: fallback });
    }
    res.json({ summary: result.summary || '' });
  } catch (e) {
    console.error('Server side summarization failed:', e);
    res.status(500).json({ error: 'Summarization handling failed', detail: e.message });
  } finally {
    try { fs.unlinkSync(tempFilePath); } catch (e) {}
  }
});

// ======== TRANSLATION =========
app.post('/translate', async (req, res) => {
  const { text, to, mode } = req.body

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
    'platform': 'site',
    'subsequently': 'next',
    'furthermore': 'also',
    'therefore': 'so',
    'prior to': 'before',
    'in order to': 'to',
    'with regard to': 'about',
    'due to the fact that': 'because',
  }

  const simplify = (s) => {
    if (!s) return s
    let t = s.replace(/\r\n?/g, '\n').replace(/[\t ]+/g, ' ').replace(/[ \u00A0]+\n/g, '\n').trim()
    const keys = Object.keys(glossary).sort((a,b)=>b.length-a.length)
    keys.forEach(k => {
      const re = new RegExp(`\\b${k.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')}\\b`, 'gi')
      t = t.replace(re, (m)=>{
        const rep = glossary[k]
        return m[0] === m[0].toUpperCase() ? rep.charAt(0).toUpperCase()+rep.slice(1) : rep
      })
    })

    t = t.replace(/\s*\d+\)\s+/g, '\n- ').replace(/\s*\d+\.\s+/g, '\n- ').replace(/\s*[•·]\s+/g, '\n- ')
    t = t.replace(/\s-\s/g, ' - ')

    const out = []
    t.split(/\n+/).forEach(line => {
      if (!line.trim()) return
      const chunks = line.split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      chunks.forEach(ch => {
        if (ch.split(' ').length > 24) {
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
const glossCache = new Map()
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
      } catch (e) {}
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
    // Limit to avoid very long URLs / API issues
    const uniq = Array.from(new Set(tokens.filter(t => typeof t === 'string' && t.trim()))).slice(0, 300)
    const base = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t`
    const joined = uniq.join('\n')
    const url = `${base}&q=${encodeURIComponent(joined)}`
    let data;
    try {
      data = await fetch(url).then(r => r.json())
    } catch (e) {
      data = null
    }
    let map = {}
    if (data && data[0]) {
      const combined = data[0].map(p => p[0]).join('')
      const parts = combined.split('\n')
      if (parts.length === uniq.length) {
        uniq.forEach((tok, i) => { map[tok] = parts[i] })
      }
    }
    // If bulk call failed or mismatch, fallback per-token
    if (Object.keys(map).length !== uniq.length) {
      map = {}
      for (const tok of uniq) {
        const u = `${base}&q=${encodeURIComponent(tok)}`
        try {
          const r = await fetch(u).then(r => r.json())
          const gloss = (r && r[0]) ? r[0].map(p => p[0]).join('') : tok
          map[tok] = gloss || tok
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
    const tts = gtts(lang || 'ta');
    const outPath = path.join(process.cwd(), 'tts.mp3');

    tts.save(outPath, text, () => {
      res.sendFile(outPath, (err) => {
        if (err) {
          console.error('Send file error:', err);
        }
        fs.unlink(outPath, () => {});
      });
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

// ======== START SERVER =========
// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-translator';
mongoose
  .connect(MONGO_URI, { dbName: process.env.MONGO_DB || undefined })
  .then(() => console.log('MongoDB connected'))
  .catch((e) => console.warn('MongoDB connection failed:', e.message));

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/history', historyRoutes)

app.listen(5000, () => console.log('Server running on port 5000'));