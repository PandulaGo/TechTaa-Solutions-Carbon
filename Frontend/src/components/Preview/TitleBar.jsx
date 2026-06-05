/* TitleBar.jsx - no imports needed, receives state via props */
export default function TitleBar({ state }) {
  return (
    <div
      className="preview-titlebar"
      style={{
        background: state.colors["titleBar.activeBackground"],
        color: state.colors["titleBar.activeForeground"],
        borderBottom: `1px solid ${state.colors["titleBar.border"] || "transparent"}`
      }}
    >
      <div className="titlebar-title">CarbonApp — VS Code Theme Studio</div>
      <div className="titlebar-controls">
        <span className="tb-btn">—</span>
        <span className="tb-btn">□</span>
        <span className="tb-btn">×</span>
      </div>
    </div>
  );
}
