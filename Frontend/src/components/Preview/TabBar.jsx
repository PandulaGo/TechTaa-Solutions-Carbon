/* TabBar.jsx - no imports needed, receives state via props */
export default function TabBar({ state }) {
  const tabs = [
    { name: "App.tsx", active: true },
    { name: "utils.ts", active: false },
    { name: "theme.json", active: false }
  ];

  return (
    <div
      className="preview-tabbar"
      style={{
        background: state.colors["editorGroupHeader.tabsBackground"],
        borderBottom: `1px solid ${state.colors["editorGroupHeader.tabsBorder"] || "#3c3c3c"}`
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`preview-tab ${tab.active ? "active" : ""}`}
          style={{
            background: tab.active
              ? state.colors["tab.activeBackground"]
              : state.colors["tab.inactiveBackground"],
            color: tab.active
              ? state.colors["tab.activeForeground"]
              : state.colors["tab.inactiveForeground"],
            borderRight: `1px solid ${state.colors["tab.border"] || "#252526"}`,
            borderTop: tab.active ? `2px solid ${state.colors["tab.activeBorderTop"] || "#007acc"}` : "2px solid transparent"
          }}
        >
          <span className="tab-icon">{tab.name.endsWith(".tsx") ? "⚛" : tab.name.endsWith(".ts") ? "📄" : "📋"}</span>
          <span className="tab-name">{tab.name}</span>
          <span className="tab-close">×</span>
        </div>
      ))}
    </div>
  );
}
