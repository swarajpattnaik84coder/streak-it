import { ChevronLeftIcon, ChevronRightIcon, ZapIcon } from "../ui/icons.jsx";
import { SEGMENTS } from "../../data/mockData.js";

export default function MapControls({
  currentSegmentId,
  totalSegments,
  onSelectSegment,
  onPrevSegment,
  onNextSegment,
  onCenterOnCurrent,
  currentLevel,
}) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 shrink-0 select-none z-20 gap-2"
      style={{
        background: "linear-gradient(180deg, rgba(10,9,18,0.96) 0%, #09090f 100%)",
        borderTop: "1px solid #1f1d30",
      }}
    >
      {/* Prev */}
      <button
        type="button"
        onClick={onPrevSegment}
        disabled={currentSegmentId <= 1}
        aria-label="Previous segment"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium
          transition-all duration-200 border border-rpg
          text-rpg-muted hover:text-amber-400 hover:border-amber-800/50 hover:bg-amber-950/20
          disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ChevronLeftIcon size={14} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Segment jumpers */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {SEGMENTS.map((seg) => {
          const isActive = seg.id === currentSegmentId;
          const hasCurrentLvl = currentLevel >= seg.levelRange[0] && currentLevel <= seg.levelRange[1];

          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => onSelectSegment(seg.id)}
              className={[
                "relative flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-cinzel transition-all duration-200 shrink-0 rounded",
                "border tracking-wide",
                isActive
                  ? "border-amber-700/60 bg-amber-950/40 text-amber-300 font-bold shadow-gold-sm"
                  : "border-rpg bg-transparent text-rpg-muted hover:text-stone-300 hover:border-stone-700/60",
              ].join(" ")}
            >
              {/* Current segment indicator dot */}
              {hasCurrentLvl && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 border border-stone-900" />
              )}
              <span>{seg.label}</span>
              <span className="opacity-50 text-[9px] font-sans hidden sm:inline">
                L{seg.levelRange[0]}–{seg.levelRange[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: NOW + Next */}
      <div className="flex items-center gap-1.5">
        {/* NOW button */}
        <button
          type="button"
          onClick={onCenterOnCurrent}
          title="Jump to current level"
          className="flex items-center gap-1 px-2 py-1.5 rounded text-[11px] font-cinzel font-bold
            border border-amber-700/50 bg-amber-950/30 text-amber-400
            hover:bg-amber-950/50 hover:border-amber-600/60 transition-all duration-200
            tracking-wider"
        >
          <ZapIcon size={13} />
          <span className="hidden md:inline">NOW</span>
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={onNextSegment}
          disabled={currentSegmentId >= totalSegments}
          aria-label="Next segment"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium
            transition-all duration-200 border border-rpg
            text-rpg-muted hover:text-amber-400 hover:border-amber-800/50 hover:bg-amber-950/20
            disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </div>
  );
}