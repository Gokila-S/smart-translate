import { useState } from "react"
import axios from "axios"

function App() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")
  const [translated, setTranslated] = useState("")
  const [lang, setLang] = useState("hi")
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const handleUpload = async () => {
    if (!file) return alert("Select a file first.")
    const form = new FormData()
    form.append("file", file)
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/upload", form)
      setText(res.data.text)
      setTranslated("")
    } catch (err) {
      alert("Error extracting text.")
    }
    setLoading(false)
  }

  const handleTranslate = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/translate", { text, to: lang })
      setTranslated(res.data.translated)
    } catch (err) {
      alert("Translation failed.")
    }
    setLoading(false)
  }

  const handleSpeak = () => {
    if (!translated.trim()) return
    if (!window.speechSynthesis) {
      alert("Text-to-Speech not supported.")
      return
    }

    const utterance = new SpeechSynthesisUtterance(translated)
    utterance.lang = lang
    setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  // 🟢 This is the CORRECT place for return
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🌐 Smart Translator</h1>

      <input type="file" accept=".txt,.pdf,image/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>Extract Text</button>

      <br /><br />
      <textarea rows={6} value={text} readOnly placeholder="Extracted text will appear here." style={{ width: "100%" }} />

      <div style={{ margin: "1em 0" }}>
        <label>Translate to: </label>
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="bn">Bengali</option>
          <option value="gu">Gujarati</option>
          <option value="te">Telugu</option>
        </select>
        <button onClick={handleTranslate} disabled={!text || loading}>Translate</button>
      </div>

      <textarea rows={6} value={translated} readOnly placeholder="Translated text will appear here." style={{ width: "100%" }} />

      <br />
      <button onClick={handleSpeak} disabled={!translated || speaking}>🔊 {speaking ? "Speaking..." : "Speak"}</button>
    </div>
  )
}

export default App
