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
import { ProgressionProvider, useProgression } from "../../lib/ProgressionContext";
import { AntiSpamProvider } from "../../lib/AntiSpamContext";

function LevelUpToastBanner() {
  const { levelUpToast } = useProgression();
  if (!levelUpToast) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        className="px-6 py-2.5 rounded-xl border-2 border-amber-400 font-cinzel font-black text-xs tracking-wider uppercase text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.65)] flex items-center gap-2.5"
        style={{
          background: "linear-gradient(180deg, #3d2310 0%, #1c0e05 100%)",
        }}
      >
        <span className="text-base">🏆</span>
        <span>{levelUpToast}</span>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const [activeNav, setActiveNav] = useState("calendar");
  const [charOpen, setCharOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(true);

  return (
    <ProgressionProvider>
      <AntiSpamProvider>
        <LevelUpToastBanner />
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
                <div className="flex-1 overflow-y-auto h-full scrollbar-thin flex flex-col min-h-0 relative">
                  {/* World Map & Today's Writs */}
                  <MapPanel />

                  {/* Collapsible Daily Task Manager Drawer */}
                  <div className="border-t border-[#1f1d30] bg-[#090814] shrink-0 pb-20">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#0e0c1e] border-b border-[#1c1930] sticky top-0 z-10">
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