import { useTheme } from "@/context/ThemeContext";
import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useRef } from "react";
import { buildMonacoTheme } from "@/utils/monacoTheme";

const SAMPLE_CODE = `import React, { useState, useEffect } from "react";

// This is a comment example
const API_URL = "https://api.example.com/v1";
const MAX_RETRIES = 3;
const TIMEOUT = 12000;

/**
 * Fetches user data from the API
 * @param {string} userId - The user ID
 * @returns {Promise<User>} The user object
 */
async function fetchUser(userId) {
  const response = await fetch(\`\${API_URL}/users/\${userId}\`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${getToken()}\`
    }
  });

  if (!response.ok) {
    throw new Error(\`Failed to fetch user: \${response.statusText}\`);
  }

  const data = await response.json();
  return transformUser(data);
}

class UserService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cache = new Map();
  }

  async getUser(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const user = await fetchUser(id);
    this.cache.set(id, user);
    return user;
  }
}

export default UserService;
`;

export default function EditorArea() {
  const { state } = useTheme();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const themeCounterRef = useRef(0);
  const currentThemeRef = useRef("carbonapp-custom-0");
  const codeRef = useRef(SAMPLE_CODE);

  const getNextThemeName = useCallback(() => {
    themeCounterRef.current += 1;
    const name = `carbonapp-custom-${themeCounterRef.current}`;
    currentThemeRef.current = name;
    return name;
  }, []);

  const applyTheme = useCallback(() => {
    if (!monacoRef.current || !editorRef.current) return;

    const monaco = monacoRef.current;
    const themeData = buildMonacoTheme(state);
    const themeName = getNextThemeName();

    // Always define a NEW theme name so Monaco fully recompiles token styles
    monaco.editor.defineTheme(themeName, themeData);
    monaco.editor.setTheme(themeName);

    // Force re-tokenization by touching the editor model
    const model = editorRef.current.getModel();
    if (model) {
      // Reset the model language to force full re-tokenization
      monaco.editor.setModelLanguage(model, "typescript");
    }
  }, [state, getNextThemeName]);

  const handleBeforeMount = useCallback((monaco) => {
    monacoRef.current = monaco;
    const themeData = buildMonacoTheme(state);
    monaco.editor.defineTheme(currentThemeRef.current, themeData);
  }, [state]);

  const handleMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.setTheme(currentThemeRef.current);
  }, []);

  // Update theme when token colors or workbench colors change
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Update font options directly via Monaco API
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        fontLigatures: state.fontLigatures
      });
    }
  }, [state.fontFamily, state.fontSize, state.fontLigatures]);

  return (
    <div className="editor-area" style={{ background: state.colors["editor.background"] }}>
      <Editor
        height="100%"
        defaultLanguage="typescript"
        value={codeRef.current}
        theme={currentThemeRef.current}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          lineNumbers: "on",
          folding: false,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          renderLineHighlight: "line",
          fontFamily: state.fontFamily,
          fontSize: state.fontSize,
          fontLigatures: state.fontLigatures,
          padding: { top: 8 },
          automaticLayout: true,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          rulers: [],
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: false,
          parameterHints: { enabled: false },
          hover: { enabled: false }
        }}
      />
    </div>
  );
}
