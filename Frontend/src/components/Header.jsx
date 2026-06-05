import { useTheme } from "@/context/ThemeContext";
import { downloadTheme } from "@/utils/serializer";
import { downloadSettings } from "@/utils/settingsSnippet";
import { useEffect, useState } from "react";
import ImportModal from "@/components/LeftPanel/ImportModal";

const FONTS = [
  "Cascadia Code",
  "Fira Code",
  "JetBrains Mono",
  "Consolas",
  "Source Code Pro",
  "Monaco",
  "Menlo",
  "Ubuntu Mono",
  "Courier New",
  "SF Mono",
  "Hack",
  "IBM Plex Mono",
  "Inconsolata",
  "Liberation Mono",
  "Victor Mono"
];

async function isFontAvailable(fontName) {
  try {
    if (typeof document !== "undefined" && "fonts" in document) {
      await document.fonts.load(`12px "${fontName}"`);
      const available = await document.fonts.check(`12px "${fontName}"`);
      return available;
    }
  } catch {
    // Fallback: try to detect via canvas
  }
  return true; // assume available if API not supported
}

export default function Header() {
  const { state, dispatch } = useTheme();
  const [showImport, setShowImport] = useState(false);
  const [fontAvailable, setFontAvailable] = useState(true);

  useEffect(() => {
    isFontAvailable(state.fontFamily).then(setFontAvailable);
  }, [state.fontFamily]);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20L6 12L18 4V20Z" fill="#007acc" stroke="#007acc" />
            </svg>
            <span className="logo-text">CarbonApp</span>
          </div>
          <input
            className="theme-name-input"
            value={state.name}
            onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
            placeholder="Theme Name"
          />
        </div>

        <div className="header-center">
          <div className="type-toggle">
            <button
              className={state.type === "dark" ? "active" : ""}
              onClick={() => dispatch({ type: "SET_TYPE", payload: "dark" })}
            >
              Dark
            </button>
            <button
              className={state.type === "light" ? "active" : ""}
              onClick={() => dispatch({ type: "SET_TYPE", payload: "light" })}
            >
              Light
            </button>
          </div>

          <div className="font-wrapper" title={fontAvailable ? "" : "This font is not installed on your system. Monaco will use a fallback."}>
            <select
              className="font-select"
              value={state.fontFamily}
              onChange={(e) => dispatch({ type: "SET_FONT_FAMILY", payload: e.target.value })}
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {!fontAvailable && (
              <span className="font-warning" title="Font not installed on this system">!</span>
            )}
          </div>

          <input
            type="number"
            className="font-size-input"
            min={10}
            max={24}
            value={state.fontSize}
            onChange={(e) => dispatch({ type: "SET_FONT_SIZE", payload: Number(e.target.value) })}
          />
        </div>

        <div className="header-right">
          <button className="btn-secondary" onClick={() => setShowImport(true)}>
            Import JSON
          </button>
          <button className="btn-secondary" onClick={() => downloadTheme(state)} title="Raw theme JSON for publishing as VS Code extension">
            Export Theme
          </button>
          <button className="btn-primary" onClick={() => {
            downloadTheme(state);
            setTimeout(() => downloadSettings(state), 300);
          }} title="Downloads theme.json + vscode-settings.json (paste into VS Code settings)">
            Download for VS Code
          </button>
        </div>
      </header>

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </>
  );
}
