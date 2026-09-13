import { useState } from "react";
import TitleBar from "./TitleBar.jsx";
import Sidebar from "./Sidebar.jsx";
import MapPanel from "./MapPanel.jsx";
import CharacterPanel from "./CharacterPanel.jsx";
import CharacterSheetModal from "../CharacterSheetModal";
import TaskManager from "../tasks/TaskManager.jsx";
import LeaderboardPage from "../../pages/LeaderboardPage.jsx";
import CharacterPage from "../../pages/CharacterPage.jsx";
import VaultPage from "../../pages/VaultPage.jsx";
import StorePage from "../../pages/StorePage.jsx";
import AuthModal from "../auth/AuthModal.jsx";
import { ProgressionProvider } from "../../lib/ProgressionContext";
import { AntiSpamProvider } from "../../lib/AntiSpamContext";

export default function AppLayout() {
  const [activeNav, setActiveNav] = useState("calendar");
  const [charOpen, setCharOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(true);

  return (
    <ProgressionProvider>
      <AntiSpamProvider>
        <div
          className="flex flex-col h-full overflow-hidden"
          style={{ background: "#07070e" }}
        >
          {/* Top bar */}
          <TitleBar
            onToggleCharPanel={() => setCharOpen((o) => !o)}
            onOpenAuth={() => setAuthOpen(true)}
          />

          {/* Main body layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left navigation sidebar */}
            <Sidebar activeId={activeNav} onSelect={setActiveNav} />

            {/* Center content view based on activeNav */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
              {activeNav === "calendar" && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                  {/* World Map */}
                  <div className="flex-1 min-h-0 relative">
                    <MapPanel />
                  </div>

                  {/* Collapsible Daily Task Manager Drawer */}
                  <div className="border-t border-[#1f1d30] bg-[#090814] max-h-[45vh] overflow-y-auto">
                    <div className="flex items-center justify-between px-4 py-1.5 bg-[#0e0c1e] border-b border-[#1c1930] sticky top-0 z-10">
                      <span className="text-[10px] font-cinzel font-bold text-amber-400 uppercase tracking-widest">
                        ⚔️ Daily Quest Log & Real-World Tasks
                      </span>
                      <button
                        onClick={() => setShowTaskManager(!showTaskManager)}
                        className="text-[10px] font-cinzel text-rpg-muted hover:text-stone-300 transition-colors uppercase"
                      >
                        {showTaskManager ? "Collapse Tasks ▼" : "Expand Tasks ▲"}
                      </button>
                    </div>

                    {showTaskManager && <TaskManager />}
                  </div>
                </div>
              )}

              {activeNav === "leaderboard" && <LeaderboardPage />}
              {activeNav === "character" && <CharacterPage />}
              {activeNav === "vault" && <VaultPage />}
              {activeNav === "store" && <StorePage />}
            </div>

            {/* Right character panel drawer */}
            <CharacterPanel isOpen={charOpen} onClose={() => setCharOpen(false)} />
          </div>

          {/* Auth Modal */}
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
        <CharacterSheetModal />
      </AntiSpamProvider>
    </ProgressionProvider>
  );
}