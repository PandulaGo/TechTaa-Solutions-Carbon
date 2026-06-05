import { useState } from "react";
import { colorCategories } from "@/data/workbenchColors";
import { tokenDefaults } from "@/data/tokenDefaults";
import { useTheme } from "@/context/ThemeContext";

function ColorRow({ colorKey, label }) {
  const { state, dispatch } = useTheme();
  const value = state.colors[colorKey] || "#000000";

  return (
    <div className="color-row">
      <label className="color-label" title={colorKey}>{label}</label>
      <div className="color-controls">
        <input
          type="color"
          value={value}
          onChange={(e) =>
            dispatch({ type: "SET_COLOR", payload: { key: colorKey, value: e.target.value } })
          }
        />
        <input
          type="text"
          className="hex-input"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
              dispatch({ type: "SET_COLOR", payload: { key: colorKey, value: val } });
            }
          }}
        />
      </div>
    </div>
  );
}

function ColorSection({ category }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="color-section">
      <button className="section-header" onClick={() => setOpen(!open)}>
        <span className={`section-chevron ${open ? "open" : ""}`}>▸</span>
        <span className="section-label">{category.label}</span>
        <span className="section-count">{category.keys.length}</span>
      </button>
      {open && (
        <div className="section-body">
          {category.keys.map((k) => (
            <ColorRow key={k.key} colorKey={k.key} label={k.label} />
          ))}
        </div>
      )}
    </div>
  );
}

function TokenRow({ token }) {
  const { state, dispatch } = useTheme();
  const current = state.tokenColors.find((t) => t.name === token.name)?.settings || token.settings;

  const fontStyles = current.fontStyle ? current.fontStyle.split(/\s+/) : [];

  function toggleStyle(style) {
    const has = fontStyles.includes(style);
    const next = has ? fontStyles.filter((s) => s !== style) : [...fontStyles, style];
    dispatch({
      type: "SET_TOKEN",
      payload: { name: token.name, settings: { fontStyle: next.join(" ") || undefined } }
    });
  }

  return (
    <div className="token-row">
      <span className="token-name">{token.name}</span>
      <div className="token-controls">
        <input
          type="color"
          value={current.foreground || "#ffffff"}
          onChange={(e) =>
            dispatch({
              type: "SET_TOKEN",
              payload: { name: token.name, settings: { foreground: e.target.value } }
            })
          }
        />
        <input
          type="text"
          className="hex-input small"
          value={current.foreground || "#ffffff"}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
              dispatch({
                type: "SET_TOKEN",
                payload: { name: token.name, settings: { foreground: val } }
              });
            }
          }}
        />
        <label className="style-toggle">
          <input
            type="checkbox"
            checked={fontStyles.includes("bold")}
            onChange={() => toggleStyle("bold")}
          />
          B
        </label>
        <label className="style-toggle">
          <input
            type="checkbox"
            checked={fontStyles.includes("italic")}
            onChange={() => toggleStyle("italic")}
          />
          I
        </label>
        <label className="style-toggle">
          <input
            type="checkbox"
            checked={fontStyles.includes("underline")}
            onChange={() => toggleStyle("underline")}
          />
          U
        </label>
      </div>
    </div>
  );
}

export default function LeftPanel() {
  const [tab, setTab] = useState("workbench");

  return (
    <aside className="left-panel">
      <div className="panel-tabs">
        <button className={tab === "workbench" ? "active" : ""} onClick={() => setTab("workbench")}>
          Workbench
        </button>
        <button className={tab === "syntax" ? "active" : ""} onClick={() => setTab("syntax")}>
          Syntax
        </button>
      </div>

      <div className="panel-content">
        {tab === "workbench" && (
          <div className="workbench-list">
            {colorCategories.map((cat) => (
              <ColorSection key={cat.id} category={cat} />
            ))}
          </div>
        )}
        {tab === "syntax" && (
          <div className="syntax-list">
            {tokenDefaults.map((token) => (
              <TokenRow key={token.name} token={token} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
