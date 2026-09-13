import { motion } from "framer-motion";
import { CURRENT_LEVEL } from "../../data/mockData.js";

const R_NORMAL  = 16;
const R_CURRENT = 22;

// ── Landmark icon for current node ───────────────────────────────────────────
function LandmarkIcon({ type }) {
  const c = "#f5c842";
  const sw = 1.3;
  if (type === "castle" || type === "fortress") return (
    <path d="M -5,6 L -5,-1 L -3,-1 L -3,1 L -1,1 L -1,-1 L 1,-1 L 1,1 L 3,1 L 3,-1 L 5,-1 L 5,6 Z"
      fill={c} fillOpacity="0.15" stroke={c} strokeWidth={sw} />
  );
  if (type === "spire" || type === "tower") return (
    <path d="M -3,6 L -2,-4 L 0,-8 L 2,-4 L 3,6 Z"
      fill={c} fillOpacity="0.15" stroke={c} strokeWidth={sw} />
  );
  if (type === "boss" || type === "throne") return (
    <path d="M -5,5 L -3,-5 L 0,-1 L 3,-5 L 5,5 Z"
      fill={c} fillOpacity="0.2" stroke={c} strokeWidth={sw} />
  );
  // default: diamond
  return (
    <path d="M 0,-7 L 5,0 L 0,7 L -5,0 Z"
      fill={c} fillOpacity="0.15" stroke={c} strokeWidth={sw} />
  );
}

// ── Check mark for completed ──────────────────────────────────────────────────
function Check() {
  return (
    <polyline points="-4.5,0.5 -1.5,3.5 5,-4"
      fill="none" stroke="#b89040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  );
}

// ── Lock icon for future levels ───────────────────────────────────────────────
function Lock() {
  return (
    <g transform="translate(0,-1)">
      <rect x="-4" y="-1" width="8" height="7" rx="1.5"
        fill="none" stroke="#342f50" strokeWidth="1.4" />
      <path d="M -2.5,-1 V -3.5 a 2.5 2.5 0 0 1 5 0 V -1"
        fill="none" stroke="#342f50" strokeWidth="1.4" />
    </g>
  );
}

export default function LevelNode({ level, onClick }) {
  const status = level.id < CURRENT_LEVEL  ? "completed"
               : level.id === CURRENT_LEVEL ? "current"
               :                              "locked";

  const isCurrent   = status === "current";
  const isCompleted = status === "completed";
  const isLocked    = status === "locked";
  const R = isCurrent ? R_CURRENT : R_NORMAL;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isLocked) onClick(level, e);
  };

  // Completed: dark gold fill, strong gold border
  // Current:   darker amber fill, bright border, glow, animations
  // Locked:    near-black fill, very dim border
  const fill   = isCompleted ? "#1c1604" : isCurrent ? "#2a1c02" : "#0c0b16";
  const stroke = isCompleted ? "#9a7c34" : isCurrent ? "#f0b020" : "#272440";
  const sw     = isCurrent ? 2.5 : isCompleted ? 1.8 : 1.2;

  return (
    <g
      transform={`translate(${level.x},${level.y})`}
      onClick={handleClick}
      style={{ cursor: isLocked ? "default" : "pointer" }}
      role={isLocked ? undefined : "button"}
      aria-label={`Level ${level.id}: ${level.name}`}
    >
      {/* ── CURRENT: animated ambient pulse rings ──────────────────────── */}
      {isCurrent && (
        <>
          <motion.circle r={R + 12} cx="0" cy="0"
            fill="none" stroke="#f0a010" strokeWidth="1.2"
            animate={{ r: [R+12, R+26], strokeOpacity: [0.55, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.circle r={R + 7} cx="0" cy="0"
            fill="none" stroke="#c9a84c" strokeWidth="1"
            animate={{ r: [R+7, R+20], strokeOpacity: [0.4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
          />
          {/* ground glow beneath */}
          <ellipse cx="0" cy={R + 7} rx={R + 6} ry="5"
            fill="#f0a010" fillOpacity="0.1" />
        </>
      )}

      {/* Invisible larger hit area */}
      <circle r={R + 6} fill="transparent" />

      {/* ── Outer decorative ring for completed/current ─────────────────── */}
      {isCompleted && (
        <circle r={R + 3} fill="none" stroke="#5a4620" strokeWidth="1" strokeDasharray="3 3" />
      )}

      {/* ── Main node circle ─────────────────────────────────────────────── */}
      <circle r={R} fill={fill} stroke={stroke} strokeWidth={sw}
        style={{ filter: isCurrent ? "drop-shadow(0 0 8px rgba(240,160,16,0.5))" : "none" }}
      />

      {/* ── Inner status icon ─────────────────────────────────────────────── */}
      {isCompleted && <Check />}
      {isLocked    && <Lock  />}
      {isCurrent   && <LandmarkIcon type={level.landmark || level.type} />}

      {/* ── Level number label (above node) ─────────────────────────────── */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        dy={isCompleted ? -(R + 7) : isCurrent ? -(R + 10) : 0}
        fontSize={isCurrent ? 12 : isCompleted ? 9 : 9}
        fontWeight={isCurrent ? "800" : "700"}
        fill={isCompleted ? "#a88a38" : isCurrent ? "#f5c040" : "#302d50"}
        fontFamily="Cinzel, serif"
        pointerEvents="none"
      >
        {level.id}
      </text>

      {/* ── Location name micro-label (for current & completed) ─────────── */}
      {(isCurrent || isCompleted) && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          dy={R + 9}
          fontSize={isCurrent ? 8 : 7}
          fontWeight="600"
          fill={isCurrent ? "#d4a030" : "#5a4a22"}
          fontFamily="Cinzel, serif"
          pointerEvents="none"
          opacity={isCurrent ? 0.9 : 0.7}
        >
          {level.name.length > 14 ? level.name.slice(0, 12) + "…" : level.name}
        </text>
      )}

      {/* ── "NOW" badge beneath current node ───────────────────────────── */}
      {isCurrent && (
        <g transform={`translate(0, ${R + 20})`}>
          <rect x="-16" y="-6" width="32" height="12" rx="6"
            fill="#b88020" stroke="#f5c040" strokeWidth="0.8" />
          <text textAnchor="middle" dominantBaseline="central"
            fontSize="7" fontWeight="900" letterSpacing="1.5"
            fill="#080812" fontFamily="system-ui, sans-serif" pointerEvents="none">
            NOW
          </text>
        </g>
      )}
    </g>
  );
}