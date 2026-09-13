import { motion } from "framer-motion";
import { CURRENT_LEVEL } from "../../data/mockData.js";

const R_NORMAL  = 16;
const R_CURRENT = 22;

function LandmarkIcon({ type }) {
  const c = "#f0c050";
  const sw = 1.5;
  if (type === "castle" || type === "fortress") return (
    <path d="M -5,6 L -5,-1 L -3,-1 L -3,1 L -1,1 L -1,-1 L 1,-1 L 1,1 L 3,1 L 3,-1 L 5,-1 L 5,6 Z"
      fill={c} fillOpacity="0.25" stroke={c} strokeWidth={sw} />
  );
  if (type === "spire" || type === "tower") return (
    <path d="M -3,6 L -2,-4 L 0,-8 L 2,-4 L 3,6 Z"
      fill={c} fillOpacity="0.25" stroke={c} strokeWidth={sw} />
  );
  if (type === "boss" || type === "throne") return (
    <path d="M -5,5 L -3,-5 L 0,-1 L 3,-5 L 5,5 Z"
      fill={c} fillOpacity="0.3" stroke={c} strokeWidth={sw} />
  );
  return (
    <path d="M 0,-7 L 5,0 L 0,7 L -5,0 Z"
      fill={c} fillOpacity="0.25" stroke={c} strokeWidth={sw} />
  );
}

function Check() {
  return (
    <polyline points="-4.5,0.5 -1.5,3.5 5,-4"
      fill="none" stroke="#f0c050" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  );
}

function Lock() {
  return (
    <g transform="translate(0,-1)">
      <rect x="-4" y="-1" width="8" height="7" rx="1.5"
        fill="none" stroke="#7a5a3a" strokeWidth="1.6" />
      <path d="M -2.5,-1 V -3.5 a 2.5 2.5 0 0 1 5 0 V -1"
        fill="none" stroke="#7a5a3a" strokeWidth="1.6" />
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

  // Movie-style antique map pin colors
  const fill   = isCompleted ? "#3d220e" : isCurrent ? "#5c300c" : "#24160a";
  const stroke = isCompleted ? "#c49339" : isCurrent ? "#f0c050" : "#593e28";
  const sw     = isCurrent ? 3 : isCompleted ? 2.2 : 1.5;

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
            fill="none" stroke="#f0c050" strokeWidth="1.5"
            animate={{ r: [R+12, R+28], strokeOpacity: [0.65, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.circle r={R + 7} cx="0" cy="0"
            fill="none" stroke="#c49339" strokeWidth="1.2"
            animate={{ r: [R+7, R+20], strokeOpacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
          <ellipse cx="0" cy={R + 8} rx={R + 8} ry="6"
            fill="#f0c050" fillOpacity="0.25" />
        </>
      )}

      {/* Hitbox */}
      <circle r={R + 8} fill="transparent" />

      {/* Outer ring */}
      {isCompleted && (
        <circle r={R + 3} fill="none" stroke="#c49339" strokeWidth="1" strokeDasharray="3 3" />
      )}

      {/* Main medallion */}
      <circle r={R} fill={fill} stroke={stroke} strokeWidth={sw}
        style={{ filter: isCurrent ? "drop-shadow(0 0 10px rgba(240,192,80,0.7))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}
      />

      {/* Inner icon */}
      {isCompleted && <Check />}
      {isLocked    && <Lock  />}
      {isCurrent   && <LandmarkIcon type={level.landmark || level.type} />}

      {/* Level number label above node */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        dy={isCompleted ? -(R + 8) : isCurrent ? -(R + 12) : -(R + 7)}
        fontSize={isCurrent ? 13 : 10}
        fontWeight="900"
        fill={isCompleted ? "#4a2c10" : isCurrent ? "#8c4b18" : "#593e28"}
        fontFamily="Cinzel, serif"
        pointerEvents="none"
      >
        {level.id}
      </text>

      {/* Location name banner below node */}
      {(isCurrent || isCompleted) && (
        <g transform={`translate(0, ${R + 12})`}>
          <rect
            x="-42"
            y="-8"
            width="84"
            height="16"
            rx="4"
            fill="#ede1c4"
            stroke="#593e28"
            strokeWidth="1.2"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fontWeight="800"
            fill="#3b2413"
            fontFamily="Cinzel, serif"
            pointerEvents="none"
          >
            {level.name.length > 14 ? level.name.slice(0, 12) + "…" : level.name}
          </text>
        </g>
      )}

      {/* "NOW" badge */}
      {isCurrent && (
        <g transform={`translate(0, ${R + 26})`}>
          <rect x="-18" y="-6" width="36" height="13" rx="6"
            fill="#8c4b18" stroke="#f0c050" strokeWidth="1" />
          <text textAnchor="middle" dominantBaseline="central"
            fontSize="8" fontWeight="900" letterSpacing="1.2"
            fill="#f5ebd6" fontFamily="Cinzel, serif" pointerEvents="none">
            NOW
          </text>
        </g>
      )}
    </g>
  );
}