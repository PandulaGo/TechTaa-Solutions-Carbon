import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { parseTheme } from "@/utils/parser";

export default function ImportModal({ onClose }) {
  const { dispatch } = useTheme();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  function handlePaste(value) {
    setText(value);
    setResult(parseTheme(value));
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handlePaste(ev.target.result);
    reader.readAsText(file);
  }

  function apply() {
    if (result && result.valid) {
      dispatch({ type: "LOAD_THEME", payload: result.state });
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Import Theme JSON</h3>
        <p className="modal-desc">
          Paste your AI-modified theme JSON or upload a <code>.json</code> file.
        </p>

        <textarea
          className="json-textarea"
          placeholder={`{\n  "name": "My Theme",\n  "type": "dark",\n  "colors": { ... },\n  "tokenColors": [ ... ]\n}`}
          value={text}
          onChange={(e) => handlePaste(e.target.value)}
          rows={12}
        />

        <div className="modal-or">— or —</div>

        <label className="file-upload-btn">
          <input type="file" accept=".json" onChange={handleFile} hidden />
          Upload .json file
        </label>

        {result && (
          <div className={`validation-msg ${result.valid ? "valid" : "invalid"}`}>
            {result.valid
              ? `Valid — ${result.stats.colors} colors, ${result.stats.tokens} token rules, type: ${result.stats.type}`
              : result.error}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            disabled={!result?.valid}
            onClick={apply}
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}
