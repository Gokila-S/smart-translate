# Smart Translator
A modern, single-page translator with OCR, word tooltips, and Text‑to‑Speech, and history. Built with React, Node.js, and Python.

## Features
- Drag & drop file upload (PDF/Image/TXT) + Extract Text
- OCR & text extraction (EasyOCR, PyMuPDF)
- Manual text entry
- Translate with friendly/formal modes
- Word tooltips for vocabulary
- Audio controls: Play, Pause, Resume, Stop + progress
- Download text/audio
- Translation history
- Soft notifications when ready

## Tech Stack
- Frontend: React (Vite), Axios, lucide-react icons, custom CSS
- Backend: Node.js, Express, Multer, node-fetch, node-gtts
- Python: EasyOCR, PyMuPDF
- 
## Prerequisites
- Node.js 18+ (or 20+)
- Python 3.x with pip

## Setup
Install dependencies and start both server and client.

```powershell
# 1) Server deps (Node)
cd server
npm ci

# 2) Python deps (OCR/PDF)
pip install -r requirements.txt

# 3) Start server (port 5000)
npm start
```

In a new terminal:

```powershell
# 4) Client deps & dev server (Vite)
cd client
npm ci
npm run dev
```

Open the client URL shown by Vite (usually http://localhost:5173).

## Usage

1. Upload or drag a PDF/Image/TXT → click **Extract Text**  
2. Select target language & style → **Translate**  
3. Hover words to see **tooltips**  
4. Play audio with **Listen controls** (Play/Pause/Resume/Stop + progress)  
5. Download **text/audio** as needed  


## Folder structure
```
client/   # React app (Vite)
server/   # Express API + Python OCR/PDF helpers
docs/     # Screenshots/assets
```

---
Made with ❣️by Gokila
