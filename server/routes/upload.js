const express = require('express')
const multer = require('multer')
const axios = require('axios')
const fs = require('fs')
const { execFile } = require('child_process')
const path = require('path')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded')

    const imagePath = path.resolve(req.file.path)
    const lang = req.body.lang || 'hi'

    // 🧠 Run Python EasyOCR
    execFile('python', ['ocr.py', imagePath], { cwd: __dirname + '/../' }, async (err, stdout, stderr) => {
      if (err) {
        console.error('❌ OCR error:', err)
        return res.status(500).send('OCR failed')
      }

      const extractedText = stdout.trim()
      console.log('🧠 OCR Text:', extractedText)

      // Translate
      const translateRes = await axios.post('https://libretranslate.de/translate', {
        q: extractedText,
        source: 'en',
        target: lang
      }, {
        headers: { accept: 'application/json' }
      })

      // Cleanup
      fs.unlinkSync(imagePath)

      res.json({ translated: translateRes.data.translatedText })
    })
  } catch (err) {
    console.error('❌ Error:', err.message)
    res.status(500).json({ error: 'Translation failed' })
  }
})

module.exports = router