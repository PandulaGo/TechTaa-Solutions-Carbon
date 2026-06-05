/* ActivityBar.jsx - no imports needed, receives state via props */
export default function ActivityBar({ state }) {
  const icons = [
    { label: "Explorer", active: true },
    { label: "Search", active: false },
    { label: "Git", active: false },
    { label: "Debug", active: false },
    { label: "Extensions", active: false }
  ];

  return (
    <div
      className="preview-activitybar"
      style={{
        background: state.colors["activityBar.background"],
        borderRight: `1px solid ${state.colors["activityBar.border"] || "transparent"}`
      }}
    >
      {icons.map((icon, i) => (
        <div
          key={i}
          className={`activity-icon ${icon.active ? "active" : ""}`}
          style={{
            color: icon.active
              ? state.colors["activityBar.foreground"]
              : state.colors["activityBar.inactiveForeground"],
            borderLeft: icon.active ? `2px solid ${state.colors["activityBar.activeBorder"] || "#fff"}` : "2px solid transparent"
          }}
          title={icon.label}
        >
          {icon.label[0]}
        </div>
      ))}
    </div>
  );
}
