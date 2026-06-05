export function generateSettingsSnippet(state) {
  const textMateRules = state.tokenColors.map((token) => ({
    scope: Array.isArray(token.scope) ? token.scope : [token.scope],
    settings: token.settings
  }));

  const semanticRules = {};
  if (state.semanticTokenColors) {
    Object.entries(state.semanticTokenColors).forEach(([key, value]) => {
      if (typeof value === "string") {
        semanticRules[key] = { foreground: value };
      } else if (typeof value === "object" && value !== null) {
        semanticRules[key] = value;
      }
    });
  }

  return JSON.stringify({
    "editor.fontFamily": state.fontFamily,
    "editor.fontSize": state.fontSize,
    "editor.fontLigatures": state.fontLigatures,
    "editor.semanticHighlighting.enabled": true,
    "workbench.colorCustomizations": state.colors,
    "editor.tokenColorCustomizations": {
      textMateRules
    },
    "editor.semanticTokenColorCustomizations": {
      rules: semanticRules,
      enabled: true
    }
  }, null, 2);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export function downloadSettings(state) {
  try {
    const settingsJson = generateSettingsSnippet(state);
    const blob = new Blob([settingsJson], { type: "application/json" });
    const filename = `${state.name.toLowerCase().replace(/\s+/g, "-")}-vscode-settings.json`;
    triggerDownload(blob, filename);
  } catch (err) {
    console.error("Export settings failed:", err);
    alert("Failed to export settings: " + err.message);
  }
}
