/* StatusBar.jsx - no imports needed, receives state via props */
export default function StatusBar({ state }) {
  return (
    <div
      className="preview-statusbar"
      style={{
        background: state.colors["statusBar.background"],
        color: state.colors["statusBar.foreground"],
        borderTop: `1px solid ${state.colors["statusBar.border"] || "transparent"}`
      }}
    >
      <div className="status-left">
        <span className="status-item">master*</span>
        <span className="status-item">0 errors</span>
        <span className="status-item">0 warnings</span>
      </div>
      <div className="status-right">
        <span className="status-item">Ln 12, Col 34</span>
        <span className="status-item">UTF-8</span>
        <span className="status-item">TypeScript</span>
        <span className="status-item">Spaces: 2</span>
        <span className="status-item">Prettier</span>
      </div>
    </div>
  );
}
