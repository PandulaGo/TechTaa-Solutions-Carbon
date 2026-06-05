# Application Architecture

> See [CONTEXT-SUMMARY.md](./CONTEXT-SUMMARY.md) for the project overview and [FULL-THEME-JSON.md](./FULL-THEME-JSON.md) for the complete theme JSON reference.

## Component Tree

```
App
├── Header
│   ├── Logo / App Title
│   ├── Theme Name Input (editable text field)
│   ├── Dark / Light Toggle
│   ├── Font Family Selector (dropdown)
│   ├── Font Size Input
│   ├── Export Button (downloads theme.json + settings.json)
│   └── Import Button (opens ImportModal)
│
├── LeftPanel (scrollable, tabbed)
│   ├── [Workbench Tab]
│   │   ├── ColorSection "Background" (collapsible)
│   │   │   └── ColorRow × N (label + swatch + hex input)
│   │   ├── ColorSection "Editor"
│   │   ├── ColorSection "Activity Bar"
│   │   ├── ColorSection "Side Bar"
│   │   ├── ColorSection "Title Bar"
│   │   ├── ColorSection "Status Bar"
│   │   ├── ColorSection "Tabs"
│   │   ├── ColorSection "Terminal"
│   │   ├── ColorSection "Lists & Trees"
│   │   ├── ColorSection "Buttons & Inputs"
│   │   └── ColorSection "Git Decorations"
│   │
│   └── [Syntax Tab]
│       └── TokenRow × N (scope label + color swatch + bold/italic/underline toggles)
│
├── VSCodePreview (right panel, fixed scroll container)
│   ├── TitleBar
│   │   └── Window title text, window controls (mock)
│   ├── ActivityBar
│   │   └── 5 icon placeholders (Explorer, Search, Git, Debug, Extensions)
│   ├── SideBar
│   │   └── Fake file tree (folders, files, indent guides)
│   ├── TabBar
│   │   └── Fake tabs (app.tsx, utils.ts, styles.css, etc.)
│   ├── EditorArea
│   │   └── <MonacoEditor> (language: typescript, sample code, read-only)
│   └── StatusBar
│       └── Language indicator, line/col, encoding, notifications
│
└── ImportModal (conditional overlay)
    ├── Textarea for pasting JSON
    ├── File upload button (alternative)
    ├── Validation feedback (valid/invalid, stats)
    ├── Cancel button
    └── Apply Theme button
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         ThemeContext                               │
│                                                                   │
│  state = {                                                        │
│    name: string,                                                  │
│    type: "dark" | "light",                                       │
│    colors: Record<string, string>,                                │
│    tokenColors: TokenRule[],                                      │
│    semanticTokenColors: Record<string, string | object>,         │
│    fontFamily: string,                                            │
│    fontSize: number,                                              │
│    fontLigatures: boolean                                         │
│  }                                                                │
│                                                                   │
│  dispatch actions:                                                │
│    SET_NAME, SET_TYPE, SET_COLOR, SET_TOKEN,                      │
│    SET_FONT_FAMILY, SET_FONT_SIZE, LOAD_THEME                     │
└─────┬──────────────┬──────────────┬──────────────┬───────────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
   LeftPanel     VSCodePreview   Monaco Editor  Import/Export
   (edits       (HTML/CSS        (defineTheme   (serializer/
    context)     binds colors)    + setTheme)     parser)
```

### Action → Effect Mapping

| Action | Trigger | Effect |
|--------|---------|--------|
| `SET_NAME` | Name input change | Updates theme name |
| `SET_TYPE` | Dark/Light toggle | Updates theme type, may affect preview backgrounds |
| `SET_COLOR` | ColorRow picker/hex change | Updates single color → VSCodePreview re-renders inline style |
| `SET_TOKEN` | TokenRow color/style change | Updates single token rule → Monaco defineTheme + setTheme |
| `LOAD_THEME` | Import modal "Apply" | Replaces entire state → all components re-render |
| `SET_FONT_FAMILY` | Font dropdown change | Updates Monaco editor font + included in settings export |
| `SET_FONT_SIZE` | Font size input | Updates Monaco editor font size + included in settings export |

### Import Flow (Detailed)

```
User clicks [Import] in Header
  → ImportModal opens
  → User pastes JSON OR uploads .json file
  → JSON.parse() tries to parse
     ├── ❌ Invalid JSON → show syntax error message
     └── ✅ Valid JSON → validateTheme(json)
          ├── ❌ Missing "type" or invalid values → show validation errors
          └── ✅ Valid theme → show stats:
               "86 colors, 24 token rules, type: dark"
  → User clicks [Apply Theme]
  → dispatch({ type: "LOAD_THEME", payload: parsedState })
  → ThemeContext updated
  → VSCodePreview + Monaco re-render
  → ImportModal closes
```

### Export Flow (Detailed)

```
User clicks [Export] in Header
  → serializer.js builds theme JSON from state:
     {
       "name": state.name,
       "type": state.type,
       "colors": state.colors,
       "tokenColors": state.tokenColors,
       "semanticTokenColors": state.semanticTokenColors
     }
  → serializer.js also builds settings snippet:
     {
       "editor.fontFamily": state.fontFamily,
       "editor.fontSize": state.fontSize,
       "editor.fontLigatures": state.fontLigatures
     }
  → Two Blob downloads triggered:
     1. <name>-color-theme.json
     2. <name>-settings.json
```

## State Shape (TypeScript)

```typescript
interface TokenRule {
  name?: string;
  scope: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string; // "bold", "italic", "underline", or combinations
  };
}

interface ThemeState {
  name: string;
  type: "dark" | "light";
  colors: Record<string, string>;
  tokenColors: TokenRule[];
  semanticTokenColors: Record<string, string | { foreground?: string; bold?: boolean; italic?: boolean; underline?: boolean }>;
  fontFamily: string;
  fontSize: number;
  fontLigatures: boolean;
}
```

## Color Keys Organization

~110 color keys organized into 11 categories:

| # | Category | Count | Representative Keys |
|---|----------|-------|---------------------|
| 1 | **Background** | 3 | `editor.background`, `sideBar.background`, `panel.background` |
| 2 | **Editor** | 22 | `editor.foreground`, `editor.lineHighlightBackground`, `editor.selectionBackground`, `editorCursor.foreground`, `editorLineNumber.foreground`, `editorLineNumber.activeForeground`, `editorWhitespace.foreground`, `editorRuler.foreground`, `editorBracketMatch.background`, `editorBracketMatch.border`, `editor.findMatchBackground`, `editor.findMatchHighlightBackground`, `editor.wordHighlightBackground`, `editor.wordHighlightStrongBackground`, `editor.selectionHighlightBackground`, `editorGutter.background`, `editorGutter.modifiedBackground`, `editorGutter.addedBackground`, `editorGutter.deletedBackground`, `editorSuggestWidget.background`, `editorSuggestWidget.selectedBackground`, `editorHoverWidget.background` |
| 3 | **Activity Bar** | 8 | `activityBar.background`, `.foreground`, `.inactiveForeground`, `.border`, `.activeBorder`, `.activeBackground`, `activityBarBadge.background`, `.foreground` |
| 4 | **Side Bar** | 7 | `sideBar.background`, `.foreground`, `.border`, `.dropBackground`, `sideBarTitle.foreground`, `sideBarSectionHeader.background`, `.foreground` |
| 5 | **Title Bar** | 5 | `titleBar.activeBackground`, `.activeForeground`, `.inactiveBackground`, `.inactiveForeground`, `.border` |
| 6 | **Status Bar** | 8 | `statusBar.background`, `.foreground`, `.border`, `.debuggingBackground`, `.debuggingForeground`, `.noFolderBackground`, `statusBarItem.activeBackground`, `.hoverBackground` |
| 7 | **Tabs** | 10 | `tab.activeBackground`, `.activeForeground`, `.activeBorder`, `.inactiveBackground`, `.inactiveForeground`, `.hoverBackground`, `.hoverForeground`, `.border`, `editorGroupHeader.tabsBackground`, `.tabsBorder` |
| 8 | **Terminal** | 18 | `terminal.background`, `.foreground`, `.selectionBackground`, `terminalCursor.foreground`, `.background`, `terminal.ansiBlack`, `terminal.ansiRed`, `terminal.ansiGreen`, `terminal.ansiYellow`, `terminal.ansiBlue`, `terminal.ansiMagenta`, `terminal.ansiCyan`, `terminal.ansiWhite`, `terminal.ansiBrightBlack`, `terminal.ansiBrightRed`, `terminal.ansiBrightGreen`, `terminal.ansiBrightYellow`, `terminal.ansiBrightBlue`, `terminal.ansiBrightMagenta`, `terminal.ansiBrightCyan`, `terminal.ansiBrightWhite` |
| 9 | **Lists & Trees** | 8 | `list.activeSelectionBackground`, `.activeSelectionForeground`, `.inactiveSelectionBackground`, `.focusBackground`, `.focusForeground`, `.hoverBackground`, `.hoverForeground`, `tree.indentGuidesStroke` |
| 10 | **Buttons & Inputs** | 15 | `button.background`, `.foreground`, `.hoverBackground`, `button.secondaryBackground`, `.secondaryForeground`, `input.background`, `.foreground`, `.border`, `.placeholderForeground`, `inputOption.activeBackground`, `.activeBorder`, `dropdown.background`, `.border`, `.foreground`, `badge.background`, `.foreground` |
| 11 | **Git Decorations** | 8 | `gitDecoration.addedResourceForeground`, `.modifiedResourceForeground`, `.deletedResourceForeground`, `.untrackedResourceForeground`, `gitDecoration.conflictingResourceForeground`, `.ignoredResourceForeground`, `gitDecoration.stageDeletedResourceForeground`, `gitDecoration.submoduleResourceForeground` |

## Token Scopes (~28)

Organized by semantic grouping:

| Group | Scopes |
|-------|--------|
| **Comments** | `comment`, `comment.line`, `comment.block`, `comment.block.documentation` |
| **Keywords** | `keyword`, `keyword.control`, `keyword.operator` |
| **Strings** | `string`, `string.quoted`, `string.template` |
| **Numbers** | `constant.numeric`, `constant.language`, `constant.character.escape` |
| **Functions** | `entity.name.function`, `support.function` |
| **Types/Classes** | `entity.name.type`, `entity.name.class`, `support.class`, `support.type` |
| **Variables** | `variable`, `variable.parameter`, `variable.language` |
| **Properties** | `variable.other.property`, `support.variable.property` |
| **Operators** | `keyword.operator`, `punctuation.accessor` |
| **Tags/Attributes** | `entity.name.tag`, `entity.other.attribute-name` |
| **Storage/Modifiers** | `storage.type`, `storage.modifier` |
| **Punctuation** | `punctuation`, `punctuation.definition.tag`, `punctuation.definition.string` |

Each token rule maps to:
```json
{
  "name": "Comment",
  "scope": "comment",
  "settings": {
    "foreground": "#6A9955",
    "fontStyle": "italic"
  }
}
```

## File Map

```
carbonapp/
├── index.html
├── package.json
├── vite.config.js
├── docs/
│   ├── README.md           (this file — context summary)
│   └── ARCHITECTURE.md     (architecture overview)
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx                # Root layout (Header + LeftPanel + VSCodePreview + ImportModal)
│   ├── App.css                # Global styles, CSS custom properties, Inter font import
│   ├── context/
│   │   ├── ThemeContext.jsx    # React Context + useReducer for theme state
│   │   └── defaultTheme.js    # Complete default dark theme (Dark+ inspired)
│   ├── data/
│   │   ├── workbenchColors.js # Exports array of { key, label, category } for all ~110 color keys
│   │   └── tokenDefaults.js   # Exports array of { name, scope, settings } for ~28 token rules
│   ├── utils/
│   │   ├── serializer.js      # ThemeState → valid VS Code theme JSON string
│   │   ├── parser.js          # Raw JSON string → validated ThemeState (with error reporting)
│   │   ├── settingsSnippet.js # Font config → settings.json string
│   │   └── monacoTheme.js     # ThemeState → Monaco defineTheme() payload
│   ├── components/
│   │   ├── Header.jsx          # Top bar: logo, name input, type toggle, font selector, import/export buttons
│   │   ├── Header.css
│   │   ├── LeftPanel/
│   │   │   ├── LeftPanel.jsx   # Tab container with [Workbench] and [Syntax] tabs
│   │   │   ├── LeftPanel.css
│   │   │   ├── ColorSection.jsx # Collapsible category section (expand/collapse with label)
│   │   │   ├── ColorRow.jsx     # Single color property: label + <input type="color"> + hex text input
│   │   │   ├── TokenRow.jsx     # Single token scope: scope label + color swatch + font style checkboxes
│   │   │   └── ImportModal.jsx  # Modal overlay for pasting/uploading JSON, validation display
│   │   └── Preview/
│   │       ├── VSCodePreview.jsx  # Full VS Code window mockup container
│   │       ├── VSCodePreview.css  # All mockup layout, positioning, and base styling
│   │       ├── TitleBar.jsx       # Window title bar with draggable area and controls
│   │       ├── ActivityBar.jsx    # Vertical icon bar with active/inactive states
│   │       ├── SideBar.jsx        # Fake file explorer with folders, files, and indent guides
│   │       ├── TabBar.jsx         # Horizontal tab row with active/inactive states
│   │       ├── EditorArea.jsx     # Monaco Editor wrapper with sample TypeScript code
│   │       └── StatusBar.jsx      # Bottom bar with language, cursor position, encoding
│   └── hooks/
│       └── useTheme.js           # Convenience hook: const { state, dispatch } = useTheme()
```

## Monaco Editor Integration

Two instances used in the application:

| Instance | Location | Language | Mode | Purpose |
|----------|----------|----------|------|---------|
| Preview | `EditorArea.jsx` | `typescript` | Read-only | Shows sample code with live syntax highlighting using the current theme |
| (Future) JSON Tab | `LeftPanel.jsx` | `json` | Editable | Direct JSON editing for power users (optional enhancement) |

### Theme Application Flow

```
tokenColors or colors change in ThemeContext
  → monacoTheme.js builds a Monaco IStandaloneThemeData object
  → monaco.editor.defineTheme("carbonapp-custom", themeData)
  → monaco.editor.setTheme("carbonapp-custom")
  → Monaco Editor re-renders with new syntax highlighting
```

The `monacoTheme.js` module maps:
- `tokenColors[].settings.foreground` → Monaco token color rules (per scope)
- `tokenColors[].settings.fontStyle` → Monaco token font style rules
- `colors["editor.background"]` → Monaco editor background
- `colors["editor.foreground"]` → Monaco editor default foreground
- `colors["editor.selectionBackground"]` → Monaco selection color
- `colors["editorCursor.foreground"]` → Monaco cursor color
- `colors["editorLineNumber.foreground"]` → Monaco gutter line numbers

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@monaco-editor/react": "^4.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0"
  }
}
```

Zero CSS framework dependency. Native `<input type="color">` for color picking. File exports use `Blob` + `URL.createObjectURL`. File imports use `FileReader` API.
