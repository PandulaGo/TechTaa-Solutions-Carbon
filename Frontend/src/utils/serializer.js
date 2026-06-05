export function serializeTheme(state) {
  return JSON.stringify({
    name: state.name,
    type: state.type,
    colors: state.colors,
    tokenColors: state.tokenColors,
    semanticTokenColors: state.semanticTokenColors,
    semanticHighlighting: true
  }, null, 2);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // Delay revoke so browser has time to start the download
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export function downloadTheme(state) {
  try {
    const themeJson = serializeTheme(state);
    const blob = new Blob([themeJson], { type: "application/json" });
    const filename = `${state.name.toLowerCase().replace(/\s+/g, "-")}-color-theme.json`;
    triggerDownload(blob, filename);
  } catch (err) {
    console.error("Export theme failed:", err);
    alert("Failed to export theme: " + err.message);
  }
}
