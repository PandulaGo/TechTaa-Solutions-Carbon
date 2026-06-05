import { createContext, useContext, useReducer } from "react";
import { defaultTheme } from "@/context/defaultTheme";

const ThemeContext = createContext(null);

function themeReducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_COLOR":
      return {
        ...state,
        colors: { ...state.colors, [action.payload.key]: action.payload.value }
      };
    case "SET_TOKEN": {
      const idx = state.tokenColors.findIndex(
        (t) => t.name === action.payload.name
      );
      if (idx === -1) return state;
      const next = [...state.tokenColors];
      next[idx] = {
        ...next[idx],
        settings: { ...next[idx].settings, ...action.payload.settings }
      };
      return { ...state, tokenColors: next };
    }
    case "SET_FONT_FAMILY":
      return { ...state, fontFamily: action.payload };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "SET_FONT_LIGATURES":
      return { ...state, fontLigatures: action.payload };
    case "LOAD_THEME":
      return {
        ...state,
        ...action.payload,
        fontFamily: action.payload.fontFamily ?? state.fontFamily,
        fontSize: action.payload.fontSize ?? state.fontSize,
        fontLigatures: action.payload.fontLigatures ?? state.fontLigatures
      };
    default:
      return state;
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, defaultTheme);
  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
