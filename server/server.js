import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import fetch from 'node-fetch'
import gtts from 'node-gtts'

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

// ======== FILE UPLOAD / OCR / PDF READER =========
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(req.file.path)
  const ext = path.extname(req.file.originalname).toLowerCase()
  let cmd

  if (ext === '.pdf') {
    cmd = `python pdf_reader.py "${filePath}"`
  } else if (ext === '.txt') {
    const content = fs.readFileSync(filePath, 'utf8')
    return res.json({ text: content })
  } else {
    cmd = `python ocr.py "${filePath}"`
  }

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      res.status(500).json({ error: stderr })
    } else {
      res.json({ text: stdout.trim() })
    }
  })
})

// ======== TRANSLATION =========
app.post('/translate', async (req, res) => {
  const { text, to } = req.body
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
  const result = await fetch(url).then(r => r.json())
  res.json({ translated: result[0].map(p => p[0]).join('') })
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
