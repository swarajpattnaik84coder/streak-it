import { MAP_CONFIG } from "../../data/mockData.js";

export default function MapBackground() {
  const { width: W, height: H } = MAP_CONFIG;

  return (
    <g className="select-none pointer-events-none">
      <defs>
        {/* Dusty Tea-Stain Age Gradients */}
        <radialGradient id="teaStain1" cx="20%" cy="30%" r="45%">
          <stop offset="0%" stopColor="#8c643b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#e6d3a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="teaStain2" cx="80%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#7a4d22" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#e6d3a8" stopOpacity="0" />
        </radialGradient>

        {/* Burnt Map Edge Vignette */}
        <radialGradient id="burntEdgeVig" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#3d220e" stopOpacity="0" />
          <stop offset="70%" stopColor="#2e1707" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#170902" stopOpacity="0.85" />
        </radialGradient>

        {/* Warm Gold Path Glow */}
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 1. PHOTOREALISTIC OLD DUSTY CARTOGRAPHY MAP IMAGE ───────────────── */}
      <image
        href="/assets/old_dusty_world_map.jpg"
        x="0"
        y="0"
        width={W}
        height={H}
        preserveAspectRatio="none"
      />

      {/* ── 2. AGED TEA STAIN & WARM PARCHMENT OVERLAYS ─────────────────────── */}
      <rect width={W} height={H} fill="url(#teaStain1)" style={{ mixBlendMode: "multiply" }} />
      <rect width={W} height={H} fill="url(#teaStain2)" style={{ mixBlendMode: "multiply" }} />
      <rect width={W} height={H} fill="#593e28" opacity="0.08" style={{ mixBlendMode: "color-burn" }} />

      {/* ── 3. ORNATE MAP BORDER & FILIGREE FRAME ─────────────────────────── */}
      <rect x="8" y="8" width={W-16} height={H-16} fill="none" stroke="#3d220e" strokeWidth="4" rx="4" />
      <rect x="14" y="14" width={W-28} height={H-28} fill="none" stroke="#c49339" strokeWidth="1.5" rx="3" />
      <rect x="18" y="18" width={W-36} height={H-36} fill="none" stroke="#7a552b" strokeWidth="1" rx="2" />

      {/* Corner Filigree Rosettes */}
      {[[22,22], [W-22,22], [22,H-22], [W-22,H-22]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <circle r="8" fill="#e6d3a8" stroke="#3d220e" strokeWidth="1.5" />
          <circle r="4" fill="#c49339" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#3d220e" strokeWidth="1.2" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#3d220e" strokeWidth="1.2" />
        </g>
      ))}

      {/* ── 4. EDGE BURNT VIGNETTE ──────────────────────────────────────────── */}
      <rect width={W} height={H} fill="url(#burntEdgeVig)" />
    </g>
  );
}