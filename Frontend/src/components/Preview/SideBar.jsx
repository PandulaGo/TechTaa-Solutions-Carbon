/* SideBar.jsx - no imports needed, receives state via props */
export default function SideBar({ state }) {
  return (
    <div
      className="preview-sidebar"
      style={{
        background: state.colors["sideBar.background"],
        color: state.colors["sideBar.foreground"],
        borderRight: `1px solid ${state.colors["sideBar.border"] || "transparent"}`
      }}
    >
      <div
        className="sidebar-header"
        style={{
          color: state.colors["sideBarTitle.foreground"],
          borderBottom: `1px solid ${state.colors["sideBarSectionHeader.border"] || "#3c3c3c"}`
        }}
      >
        EXPLORER
      </div>
      <div className="sidebar-tree">
        <div className="tree-item tree-folder expanded">
          <span style={{ color: state.colors["gitDecoration.untrackedResourceForeground"] }}>▾</span>
          <span className="tree-label">CarbonApp</span>
        </div>
        <div className="tree-item tree-indent">
          <span style={{ color: state.colors["gitDecoration.untrackedResourceForeground"] }}>▾</span>
          <span className="tree-label">src</span>
        </div>
        <div className="tree-item tree-indent2">
          <span className="tree-label">components</span>
        </div>
        <div className="tree-item tree-indent2">
          <span className="tree-label" style={{ color: state.colors["list.highlightForeground"] }}>App.tsx</span>
        </div>
        <div className="tree-item tree-indent2">
          <span className="tree-label">utils.ts</span>
        </div>
        <div className="tree-item tree-indent">
          <span>▸</span>
          <span className="tree-label">public</span>
        </div>
        <div className="tree-item tree-indent">
          <span className="tree-label">package.json</span>
        </div>
        <div className="tree-item tree-indent">
          <span className="tree-label">tsconfig.json</span>
        </div>
        <div className="tree-item tree-folder">
          <span>▸</span>
          <span className="tree-label">.gitignore</span>
        </div>
      </div>
    </div>
  );
}
