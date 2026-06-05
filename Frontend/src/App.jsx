import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel/LeftPanel";
import VSCodePreview from "@/components/Preview/VSCodePreview";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <LeftPanel />
          <VSCodePreview />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
