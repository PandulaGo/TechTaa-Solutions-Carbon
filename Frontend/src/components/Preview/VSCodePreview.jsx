import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import SideBar from "./SideBar";
import TabBar from "./TabBar";
import EditorArea from "./EditorArea";
import StatusBar from "./StatusBar";
import { useTheme } from "@/context/ThemeContext";

export default function VSCodePreview() {
  const { state } = useTheme();

  return (
    <div className="preview-container">
      <div
        className="vscode-mockup"
        style={{
          border: `1px solid ${state.colors["focusBorder"] || "#30363d"}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}
      >
        <TitleBar state={state} />
        <div className="vscode-body">
          <ActivityBar state={state} />
          <SideBar state={state} />
          <div className="vscode-editor-zone">
            <TabBar state={state} />
            <EditorArea />
          </div>
        </div>
        <StatusBar state={state} />
      </div>
    </div>
  );
}
