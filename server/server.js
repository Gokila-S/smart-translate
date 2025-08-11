import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(req.file.path)
  const ext = path.extname(req.file.originalname).toLowerCase()
  let cmd

  if (ext === '.pdf')
    cmd = `python pdf_reader.py "${filePath}"`
  else if (ext === '.txt') {
    const content = fs.readFileSync(filePath, 'utf8')
    return res.json({ text: content })
  } else
    cmd = `python ocr.py "${filePath}"`

  exec(cmd, (err, stdout, stderr) => {
    err ? res.status(500).json({ error: stderr }) : res.json({ text: stdout.trim() })
  })
})

app.post('/translate', async (req, res) => {
  const { text, to } = req.body
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
  const result = await fetch(url).then(r => r.json())
  res.json({ translated: result[0].map(p => p[0]).join('') })
})

app.post('/speak', (req, res) => {
  const { text } = req.body
  const out = 'tts.mp3'
  const safeText = text.replace(/"/g, '\\"') // escape quotes
  exec(`edge-tts --text "${safeText}" --write-media "${out}"`, err =>
    err ? res.status(500).send('TTS error') : res.sendFile(path.resolve(out))
  )
})

app.listen(5000, () => console.log('Server running on port 5000'))
