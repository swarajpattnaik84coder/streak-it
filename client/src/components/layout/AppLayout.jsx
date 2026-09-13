import { useState } from "react";
import TitleBar from "./TitleBar.jsx";
import Sidebar from "./Sidebar.jsx";
import MapPanel from "./MapPanel.jsx";
import CharacterPanel from "./CharacterPanel.jsx";
import CharacterSheetModal from "../CharacterSheetModal";
import { ProgressionProvider } from "../../lib/ProgressionContext";
import { AntiSpamProvider } from "../../lib/AntiSpamContext";

export default function AppLayout() {
  const [activeNav, setActiveNav] = useState("calendar");
  const [charOpen,  setCharOpen ] = useState(false);

  return (
    <ProgressionProvider>
      <AntiSpamProvider>
      <div
        className="flex flex-col h-full overflow-hidden"
        style={{ background: "#07070e" }}
      >
        {/* Top bar */}
        <TitleBar onToggleCharPanel={() => setCharOpen(o => !o)} />

        {/* Three-column body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left navigation */}
          <Sidebar activeId={activeNav} onSelect={setActiveNav} />

          {/* Center map — fills remaining space */}
          <MapPanel />

          {/* Right character panel */}
          <CharacterPanel isOpen={charOpen} onClose={() => setCharOpen(false)} />
        </div>
      </div>
      <CharacterSheetModal />
      </AntiSpamProvider>
    </ProgressionProvider>
  );
}