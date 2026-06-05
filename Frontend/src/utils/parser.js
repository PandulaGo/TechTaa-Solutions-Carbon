export function parseTheme(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      return { valid: false, error: "Invalid JSON: expected an object" };
    }
    if (!parsed.type || !["dark", "light", "hc"].includes(parsed.type)) {
      return { valid: false, error: 'Missing or invalid "type" field (expected "dark", "light", or "hc")' };
    }
    if (!parsed.colors || typeof parsed.colors !== "object") {
      return { valid: false, error: 'Missing or invalid "colors" field' };
    }

    // Normalize tokenColors
    let tokenColors = [];
    if (Array.isArray(parsed.tokenColors)) {
      tokenColors = parsed.tokenColors.filter(
        (t) => t && t.settings && (t.scope || t.name)
      );
    }

    // Normalize semanticTokenColors
    const semanticTokenColors = parsed.semanticTokenColors && typeof parsed.semanticTokenColors === "object"
      ? parsed.semanticTokenColors
      : {};

    const colorCount = Object.keys(parsed.colors).length;

    return {
      valid: true,
      state: {
        name: parsed.name || "Imported Theme",
        type: parsed.type,
        colors: parsed.colors,
        tokenColors,
        semanticTokenColors,
        fontFamily: "Cascadia Code",
        fontSize: 14,
        fontLigatures: true
      },
      stats: { colors: colorCount, tokens: tokenColors.length, type: parsed.type }
    };
  } catch (e) {
    return { valid: false, error: `JSON parse error: ${e.message}` };
  }
}
