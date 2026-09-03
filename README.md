# CarbonApp — VS Code Theme Studio

A React-based web application for creating, previewing, and exporting custom VS Code color themes. Designed to work in tandem with external AI tools (ChatGPT, Claude, etc.) for rapid theme generation.

Building a VS Code theme entirely by hand in JSON is tedious — there are over 100 color keys and dozens of token scopes. CarbonApp solves this with a visual editor that previews every change in real time, paired with an AI-friendly export/import loop for bulk generation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing npm Packages](#installing-npm-packages)
  - [Starting the Application](#starting-the-application)
  - [Application Startup IP & Port](#application-startup-ip--port)
- [Available Scripts](#available-scripts)
- [Workflow](#workflow)
- [Documentation](#documentation)

## Features

- **Live VS Code Mockup**: Full window preview — Title Bar, Activity Bar, Sidebar, Tabs, Editor, Status Bar — all bound to theme colors
- **Monaco Editor Preview**: Real syntax highlighting using the theme's token color rules
- **~110 Workbench Color Keys**: 11 categorized sections covering every VS Code UI zone
- **~28 Token Scopes**: Syntax highlighting for comment, keyword, string, number, function, class, variable, and more
- **Import/Export Loop**: Export complete JSON → modify with AI → import back → see changes instantly
- **Companion Settings Export**: Downloads `settings.json` snippet with font family, size, and ligatures
- **Font Selector**: Built-in list of popular coding fonts with live preview
- **Dark/Light Type Toggle**: Switch between theme base types
- **No Backend**: 100% client-side — all processing happens in the browser

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Code Editor | @monaco-editor/react (dual instance) |
| State Management | React Context + useReducer |
| Styling | Plain CSS, Inter font family, dark-themed UI |
| Color Picking | Native `<input type="color">` |
| File Export | Blob + URL.createObjectURL |
| Language | JavaScript (JSX) with ESLint |

## Project Structure

```
carbonapp/
├── Frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Root layout (Header + LeftPanel + VSCodePreview + ImportModal)
│       ├── App.css             # Global styles, CSS custom properties, Inter font import
│       ├── context/
│       │   ├── ThemeContext.jsx    # React Context + useReducer for theme state
│       │   └── defaultTheme.js     # Complete default dark theme (Dark+ inspired)
│       ├── data/
│       │   ├── workbenchColors.js  # Exports array of { key, label, category } for all ~110 color keys
│       │   └── tokenDefaults.js    # Exports array of { name, scope, settings } for ~28 token rules
│       ├── utils/
│       │   ├── serializer.js       # ThemeState → valid VS Code theme JSON string
│       │   ├── parser.js           # Raw JSON string → validated ThemeState (with error reporting)
│       │   ├── settingsSnippet.js  # Font config → settings.json string
│       │   └── monacoTheme.js      # ThemeState → Monaco defineTheme() payload
│       ├── components/
│       │   ├── Header.jsx          # Top bar: logo, name input, type toggle, font selector, import/export buttons
│       │   ├── LeftPanel/          # Tab container with [Workbench] and [Syntax] tabs + color/token editors
│       │   └── Preview/            # VSCodePreview mockup (TitleBar, ActivityBar, SideBar, TabBar, EditorArea, StatusBar)
│       └── hooks/
│           └── useTheme.js         # Convenience hook: const { state, dispatch } = useTheme()
└── docs/
    ├── ARCHITECTURE.md        # Component tree, data flow, state shape, file map, Monaco integration
    ├── CONTEXT-SUMMARY.md     # Project overview and AI workflow
    └── FULL-THEME-JSON.md     # Complete VS Code theme JSON reference / AI prompt payload
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended) — this project uses Vite 8, which requires a modern Node runtime
- **npm** (bundled with Node.js)

To check your installed versions:

```bash
node --version
npm --version
```

### Installing npm Packages

From the project root, navigate into the `Frontend` directory and install dependencies:

```bash
cd Frontend
npm install
```

This reads `package.json` / `package-lock.json` and installs the following key packages:

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | Core React runtime |
| `@monaco-editor/react` | Monaco code editor for syntax highlighting preview |
| `vite` | Development server & build tool |
| `@vitejs/plugin-react` | React plugin for Vite |
| `eslint` + plugins | Linting |

### Starting the Application

Start the Vite development server (run from inside the `Frontend` folder):

```bash
npm run dev
```

### Application Startup IP & Port

The Carbon application is assigned dedicated startup ports for its Backend and Frontend services. By default the services bind to `localhost` (127.0.0.1).

| Service | Protocol | Port | URL |
|---------|----------|------|-----|
| Backend | HTTP | **10051** | `http://localhost:10051` |
| Backend | HTTPS | **10052** | `https://localhost:10052` |
| Frontend | HTTP | **10055** | `http://localhost:10055` |
| Frontend | HTTPS | **10056** | `https://localhost:10056` |

**Frontend startup:**

```bash
npm run dev            # serves the frontend on http://localhost:10055
```

To start the frontend on its assigned port explicitly (or as a fallback if it is not configured in `vite.config.js`):

```bash
npm run dev -- --port 10055
```

> **Note:** If a port is already in use, Vite automatically picks the next available port and prints the actual URL in the terminal output.

To expose the frontend over HTTPS on port **10056**, use `vite` with the `--https` flag:

```bash
npm run dev -- --https --port 10056
```

To make the server available on your local network (e.g., for mobile testing or other devices):

```bash
npm run dev -- --host
```

You will then see local network addresses listed in the terminal (e.g., `http://192.168.x.x:10055`).

> **Backend note:** Backend ports **10051 (HTTP)** and **10052 (HTTPS)** are reserved for the future API service. No backend code exists in this repository yet — the current app is a 100% client-side frontend.

## Available Scripts

Run these from inside the `Frontend` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at `http://localhost:10055` |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

## Workflow

| Step | Action | Where |
|------|--------|-------|
| 1 | Tweak colors or start from defaults | CarbonApp |
| 2 | Export complete theme JSON | CarbonApp → download |
| 3 | Paste JSON into AI tool with instructions | ChatGPT / Claude / etc. |
| 4 | AI returns modified JSON | — |
| 5 | Import JSON back into CarbonApp | CarbonApp → Import button |
| 6 | Preview theme in Monaco editor mockup | CarbonApp |
| 7 | Final tweaks via color pickers | CarbonApp |
| 8 | Download theme + settings files | CarbonApp → Download |

## Documentation

Additional reference documentation is available in the [`docs/`](./docs) folder:

- [Application Architecture](./docs/ARCHITECTURE.md) — Component tree, data flow, state shape, file map, Monaco integration details
- [Context Summary](./docs/CONTEXT-SUMMARY.md) — Project overview, concept, and AI-assisted theme generation workflow
- [Full Theme JSON](./docs/FULL-THEME-JSON.md) — Complete VS Code theme JSON with all color keys and token rules, usable as the export format and AI prompt payload
