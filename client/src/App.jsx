import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Globe, Play, Loader2 } from "lucide-react";
import "./App.css";

// The main application component for the Smart Translator app.
// It handles file uploads for text extraction, translation, and text-to-speech.
function App() {
  // State variables for managing the application's data and UI state.
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [lang, setLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [audioObj, setAudioObj] = useState(null);
const [voices, setVoices] = useState([]);

useEffect(() => {
  const loadVoices = () => {
    const allVoices = window.speechSynthesis.getVoices();
    setVoices(allVoices);
    console.log("Available voices:", allVoices.map(v => `${v.name} (${v.lang})`));
  };

  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices(); // in case voices already loaded
}, []);

  // Function to handle file uploads and initiate text extraction.
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      // Send the file to the backend for OCR processing.
      const res = await axios.post("http://localhost:5000/upload", form);
      setText(res.data.text);
      setTranslated(""); // Clear previous translation when a new file is uploaded.
    } catch (err) {
      console.error("Error extracting text:", err);
      // Display a user-friendly message instead of a raw alert.
      alert("Error extracting text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle text translation.
  const handleTranslate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      // Send the extracted text and target language to the translation service.
      const res = await axios.post("http://localhost:5000/translate", { text, to: lang });
      setTranslated(res.data.translated);
    } catch (err) {
      console.error("Translation failed:", err);
      alert("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle text-to-speech conversion.
  const handleSpeak = async () => {
  if (!translated.trim()) return;

  setSpeaking(true); // start speaking state

  try {
    const res = await fetch("http://localhost:5000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: translated, lang })
    });

    if (!res.ok) {
      throw new Error("TTS request failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    // When audio finishes, reset state
    audio.onended = () => {
      setSpeaking(false);
    };

    audio.onerror = () => {
      setSpeaking(false);
      console.error("Error playing audio");
    };

    audio.play();
  } catch (err) {
    console.error("TTS error:", err);
    setSpeaking(false);
  }
};


  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="app-title">
          Smart Translator 🌐
        </h1>

        <p className="app-description">
          Upload a document or enter text to get an instant translation and listen to the result.
        </p>

        {/* File Upload Section */}
        <div className="input-group">
          <label htmlFor="file-upload" className="input-label">
            Upload File
          </label>
          <div className="file-input-container">
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn btn-extract"
            >
              {loading ? (
                <Loader2 className="loader-icon animate-spin" size={20} />
              ) : (
                <>
                  <Upload size={20} className="icon" /> Extract Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Text Area for Extracted Text */}
        <div className="input-group">
          <label className="input-label">Original Text</label>
          <textarea
            rows={6}
            value={text}
            readOnly
            placeholder="Extracted text will appear here."
            className="textarea"
          />
        </div>

        {/* Translation Controls */}
        <div className="translation-controls">
          <div className="language-selector-group">
            <Globe size={24} className="text-gray-400" />
            <label htmlFor="lang-select" className="input-label">
              Translate to:
            </label>
            <select
              id="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="language-selector"
            >
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="bn">Bengali</option>
              <option value="gu">Gujarati</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <button
            onClick={handleTranslate}
            disabled={!text || loading}
            className="btn btn-translate"
          >
            {loading ? (
              <Loader2 className="loader-icon animate-spin" size={20} />
            ) : (
              <>
                Translate
              </>
            )}
          </button>
        </div>

        {/* Text Area for Translated Text */}
        <div className="input-group">
          <label className="input-label">Translated Text</label>
          <textarea
            rows={6}
            value={translated}
            readOnly
            placeholder="Translated text will appear here."
            className="textarea"
          />
        </div>

        {/* Speak Button */}
        <div className="text-center">
          <button
            onClick={handleSpeak}
            disabled={!translated || speaking}
            className="btn btn-speak"
          >
            {speaking ? (
              <Loader2 className="loader-icon animate-spin" size={20} />
            ) : (
              <Play size={20} className="icon" />
            )}
            {speaking ? "Speaking..." : "Speak"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
