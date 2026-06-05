export function buildMonacoTheme(state) {
  const rules = [];

  state.tokenColors.forEach((token) => {
    const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
    const { foreground, background, fontStyle } = token.settings || {};
    scopes.forEach((scope) => {
      if (!scope) return;
      const rule = { token: scope };
      if (foreground) rule.foreground = foreground.replace("#", "");
      if (background) rule.background = background.replace("#", "");
      if (fontStyle) {
        const styles = fontStyle.split(/\s+/);
        if (styles.includes("bold")) rule.fontStyle = rule.fontStyle ? rule.fontStyle + " bold" : "bold";
        if (styles.includes("italic")) rule.fontStyle = rule.fontStyle ? rule.fontStyle + " italic" : "italic";
        if (styles.includes("underline")) rule.fontStyle = rule.fontStyle ? rule.fontStyle + " underline" : "underline";
      }
      rules.push(rule);
    });
  });

  // Add semantic fallback rules if semanticHighlighting is enabled
  if (state.semanticTokenColors && Object.keys(state.semanticTokenColors).length > 0) {
    const semanticMap = {
      "comment": "comment",
      "keyword": "keyword",
      "string": "string",
      "number": "constant.numeric",
      "function": "entity.name.function",
      "method": "entity.name.function",
      "class": "entity.name.type",
      "type": "entity.name.type",
      "variable": "variable",
      "parameter": "variable.parameter",
      "property": "variable.other.property",
      "operator": "keyword.operator",
      "label": "entity.name.label",
      "namespace": "entity.name.namespace",
      "enum": "entity.name.type.enum",
      "enumMember": "variable.other.enummember",
      "decorator": "entity.name.function.decorator",
      "interface": "entity.name.type.interface"
    };

    Object.entries(state.semanticTokenColors).forEach(([key, value]) => {
      const baseType = key.split(".")[0].split(":")[0];
      const scope = semanticMap[baseType];
      if (scope && typeof value === "string") {
        rules.push({ token: scope, foreground: value.replace("#", "") });
      }
    });
  }

  return {
    base: state.type === "light" ? "vs" : "vs-dark",
    inherit: true,
    rules,
    colors: {
      "editor.background": state.colors["editor.background"] || "#1e1e1e",
      "editor.foreground": state.colors["editor.foreground"] || "#d4d4d4",
      "editor.selectionBackground": state.colors["editor.selectionBackground"] || "#264f78",
      "editor.lineHighlightBackground": state.colors["editor.lineHighlightBackground"] || "#2a2d2e",
      "editorCursor.foreground": state.colors["editorCursor.foreground"] || "#aeafad",
      "editorWhitespace.foreground": state.colors["editorWhitespace.foreground"] || "#3b3b3b",
      "editorIndentGuide.background": state.colors["editorIndentGuide.background"] || "#404040",
      "editorIndentGuide.activeBackground": state.colors["editorIndentGuide.activeBackground"] || "#707070",
      "editorLineNumber.foreground": state.colors["editorLineNumber.foreground"] || "#858585",
      "editorLineNumber.activeForeground": state.colors["editorLineNumber.activeForeground"] || "#c6c6c6",
      "editor.findMatchBackground": state.colors["editor.findMatchBackground"] || "#515c6a",
      "editor.findMatchHighlightBackground": state.colors["editor.findMatchHighlightBackground"] || "#ea5c0055",
      "editorBracketMatch.background": state.colors["editorBracketMatch.background"] || "#0064001a",
      "editorBracketMatch.border": state.colors["editorBracketMatch.border"] || "#888888",
      "editorError.foreground": state.colors["editorError.foreground"] || "#f44747",
      "editorWarning.foreground": state.colors["editorWarning.foreground"] || "#cca700",
      "editorInfo.foreground": state.colors["editorInfo.foreground"] || "#75beff",
      "editorGutter.background": state.colors["editorGutter.background"] || "#1e1e1e",
      "editorGutter.modifiedBackground": state.colors["editorGutter.modifiedBackground"] || "#1b81a8",
      "editorGutter.addedBackground": state.colors["editorGutter.addedBackground"] || "#487e02",
      "editorGutter.deletedBackground": state.colors["editorGutter.deletedBackground"] || "#c53030"
    }
  };
}
