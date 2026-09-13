import { MAP_CONFIG } from "../../data/mockData.js";

export default function MapBackground() {
  const { width: W, height: H } = MAP_CONFIG;

  return (
    <g className="select-none pointer-events-none">
      <defs>
        {/* Antique Parchment Paper Texture Pattern */}
        <pattern id="landTexture" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
          <rect width="160" height="160" fill="#e6d3a8" />
          {/* Subtle noise specks for aged paper */}
          <circle cx="20" cy="18" r="1.0" fill="#b0956b" opacity="0.3" />
          <circle cx="95" cy="40" r="1.5" fill="#a0855b" opacity="0.25" />
          <circle cx="58" cy="115" r="0.9" fill="#90754b" opacity="0.3" />
          <circle cx="142" cy="82" r="1.2" fill="#a58a60" opacity="0.3" />
          <circle cx="38" cy="140" r="1.4" fill="#b0956b" opacity="0.2" />
        </pattern>

        {/* Dusty Tea-Stain Age Gradients */}
        <radialGradient id="teaStain1" cx="20%" cy="30%" r="35%">
          <stop offset="0%" stopColor="#b89b6b" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e6d3a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="teaStain2" cx="80%" cy="70%" r="40%">
          <stop offset="0%" stopColor="#ac8c5b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e6d3a8" stopOpacity="0" />
        </radialGradient>

        {/* Vintage Ocean Water Gradient */}
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a9b9a" />
          <stop offset="50%" stopColor="#678887" />
          <stop offset="100%" stopColor="#52706f" />
        </linearGradient>
        <linearGradient id="coastShade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d5bf92" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#678887" stopOpacity="0" />
        </linearGradient>

        {/* Mountain shading — vintage hand-hatched sepia */}
        <linearGradient id="mtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8c643b" />
          <stop offset="50%" stopColor="#6d4c2b" />
          <stop offset="100%" stopColor="#4a3119" />
        </linearGradient>

        {/* Regional tint glows (warm sepia) */}
        <radialGradient id="ashlandsGlow" cx="25%" cy="60%" r="25%">
          <stop offset="0%" stopColor="#b36b3b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b36b3b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="stonemarkGlow" cx="50%" cy="50%" r="25%">
          <stop offset="0%" stopColor="#a3824b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a3824b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="citadelGlow" cx="90%" cy="35%" r="20%">
          <stop offset="0%" stopColor="#8c4b26" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8c4b26" stopOpacity="0" />
        </radialGradient>

        {/* Burnt Map Edge Vignette */}
        <radialGradient id="burntEdgeVig" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#4a2e16" stopOpacity="0" />
          <stop offset="75%" stopColor="#3d220e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#241105" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      {/* ── 1. BASE PARCHMENT LAND MASS ──────────────────────────────────────── */}
      <rect width={W} height={H} fill="url(#landTexture)" />
      <rect width={W} height={H} fill="url(#teaStain1)" />
      <rect width={W} height={H} fill="url(#teaStain2)" />

      {/* ── 2. CONTINENT COASTLINE & VINTAGE OCEAN ────────────────────────────── */}
      {/* Main southern ocean */}
      <path
        d={`M 0,${H*0.78} C 300,${H*0.82} 600,${H*0.75} 900,${H*0.80}
            S 1300,${H*0.73} 1600,${H*0.79} S 2000,${H*0.72} 2400,${H*0.77}
            S 2900,${H*0.72} ${W},${H*0.76} L ${W},${H} L 0,${H} Z`}
        fill="url(#oceanGrad)"
        stroke="#4a6362"
        strokeWidth="2"
      />
      {/* Coastal wave lines */}
      <path
        d={`M 0,${H*0.77} C 300,${H*0.81} 600,${H*0.74} 900,${H*0.79}
            S 1300,${H*0.72} 1600,${H*0.78} S 2000,${H*0.71} 2400,${H*0.76}
            S 2900,${H*0.71} ${W},${H*0.75}`}
        fill="none"
        stroke="#8fb5b4"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <path
        d={`M 0,${H*0.76} C 300,${H*0.80} 600,${H*0.73} 900,${H*0.78}`}
        fill="none"
        stroke="#a5c7c6"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* ── 3. REGIONAL SEPIA TINTS ──────────────────────────────────────────── */}
      <rect width={W} height={H} fill="url(#ashlandsGlow)" />
      <rect width={W} height={H} fill="url(#stonemarkGlow)" />
      <rect width={W} height={H} fill="url(#citadelGlow)" />

      {/* ── 4. MOUNTAINS (Hand-drawn Sepia Peaks) ────────────────────────────── */}
      {/* Range 1: Ashlands Peaks */}
      <path
        d="M 50,195 L 85,145 L 115,190 L 150,130 L 195,188 L 240,125 L 290,192 L 345,118 L 400,188 L 450,130 L 500,195 Z"
        fill="#52391e" stroke="#36220e" strokeWidth="1.5"
      />
      <path
        d="M 60,200 L 95,140 L 130,195 L 160,122 L 205,190 L 250,118 L 305,195 L 360,110 L 415,195 L 468,128 L 520,198 Z"
        fill="url(#mtnGrad)" stroke="#36220e" strokeWidth="1.5"
      />
      {/* Snow/Light shading on peaks */}
      <path d="M 95,140 L 102,152 L 88,152 Z" fill="#f0e2c3" opacity="0.8" />
      <path d="M 160,122 L 168,135 L 152,135 Z" fill="#f0e2c3" opacity="0.8" />
      <path d="M 250,118 L 258,132 L 242,132 Z" fill="#f0e2c3" opacity="0.8" />
      <path d="M 360,110 L 370,125 L 350,125 Z" fill="#f0e2c3" opacity="0.8" />

      {/* Range 2: Stonemark Iron Spine */}
      <path
        d="M 880,210 L 930,112 L 990,200 L 1048,95 L 1110,192 L 1172,98 L 1245,198 L 1322,88 L 1398,205 L 1460,108 L 1530,210 Z"
        fill="url(#mtnGrad)" stroke="#36220e" strokeWidth="1.5"
      />
      <path d="M 930,112 L 940,126 L 920,126 Z" fill="#f0e2c3" opacity="0.75" />
      <path d="M 1048,95 L 1058,110 L 1038,110 Z" fill="#f0e2c3" opacity="0.75" />
      <path d="M 1172,98 L 1182,112 L 1162,112 Z" fill="#f0e2c3" opacity="0.75" />
      <path d="M 1322,88 L 1334,105 L 1310,105 Z" fill="#f0e2c3" opacity="0.75" />

      {/* Range 3: Ironveil Storm Peaks */}
      <path
        d="M 1712,192 L 1774,85 L 1848,185 L 1920,70 L 1998,178 L 2078,78 L 2158,188 L 2248,82 L 2336,192 Z"
        fill="url(#mtnGrad)" stroke="#36220e" strokeWidth="1.5"
      />
      <path d="M 1774,85 L 1785,100 L 1763,100 Z" fill="#f0e2c3" opacity="0.7" />
      <path d="M 1920,70 L 1932,86 L 1908,86 Z" fill="#f0e2c3" opacity="0.7" />
      <path d="M 2078,78 L 2090,95 L 2066,95 Z" fill="#f0e2c3" opacity="0.7" />

      {/* Range 4: Citadel Crown */}
      <path
        d="M 2614,185 L 2696,60 L 2780,172 L 2870,40 L 2962,158 L 3055,32 L 3150,165 L 3250,42 L 3350,178 L 3448,52 L 3550,185 Z"
        fill="url(#mtnGrad)" stroke="#36220e" strokeWidth="1.6"
      />
      <path d="M 2696,60 L 2710,80 L 2682,80 Z" fill="#f0e2c3" opacity="0.8" />
      <path d="M 2870,40 L 2886,62 L 2854,62 Z" fill="#f0e2c3" opacity="0.8" />
      <path d="M 3055,32 L 3072,56 L 3038,56 Z" fill="#f0e2c3" opacity="0.85" />
      <path d="M 3250,42 L 3268,66 L 3232,66 Z" fill="#f0e2c3" opacity="0.8" />

      {/* ── 5. VINTAGE FORESTS (Muted Olive Trees) ────────────────────────── */}
      {[
        [195,430,1.1], [230,415,1.0], [265,440,0.9], [300,420,1.1],
        [330,408,0.9], [580,355,1.0], [615,370,1.1], [650,345,0.95],
        [1040,370,1.0], [1075,388,1.1], [1115,360,0.9], [1148,378,1.05],
        [1460,328,1.0], [1498,310,0.9], [1535,335,1.1],
        [1888,402,1.0], [1928,420,1.05], [1968,395,0.95],
        [2090,350,1.1], [2130,368,0.9],
        [2442,328,1.0], [2480,348,1.1], [2515,322,0.95],
        [2812,418,1.0], [2852,438,1.05], [2888,412,0.9],
        [3175,318,1.1], [3215,335,0.9],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
          <polygon points="0,-14 8,0 -8,0" fill="#425c3e" stroke="#2a3d27" strokeWidth="0.8" />
          <polygon points="0,-20 6,-8 -6,-8" fill="#52734e" stroke="#2a3d27" strokeWidth="0.7" />
          <rect x="-1.5" y="0" width="3" height="5" fill="#2b1f13" />
        </g>
      ))}

      {/* ── 6. VINTAGE INK RIVERS ────────────────────────────────────────────── */}
      <path
        d="M 490,0 C 510,80 480,180 510,280 S 560,380 640,450"
        fill="none" stroke="#52706f" strokeWidth="4" strokeLinecap="round"
      />
      <path
        d="M 1340,0 C 1360,100 1330,210 1368,320 S 1440,410 1510,460"
        fill="none" stroke="#52706f" strokeWidth="3.5" strokeLinecap="round"
      />
      <path
        d="M 2190,0 C 2215,130 2200,250 2230,370 S 2320,438 2400,470"
        fill="none" stroke="#52706f" strokeWidth="3" strokeLinecap="round"
      />

      {/* ── 7. ANCIENT COMPASS ROSE (Movie Style Filigree) ────────────────── */}
      <g transform="translate(672, 115)">
        <circle cx="0" cy="0" r="32" fill="#e6d3a8" stroke="#7a552b" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="26" fill="none" stroke="#a67c42" strokeWidth="1" strokeDasharray="3 3" />
        {/* N Arrow */}
        <polygon points="0,-42 6,-8 0,-14 -6,-8" fill="#8c4b26" stroke="#4a280e" strokeWidth="0.8" />
        <polygon points="0,-42 -6,-8 0,-14" fill="#c49339" />
        {/* S Arrow */}
        <polygon points="0,42 6,8 0,14 -6,8" fill="#7a552b" />
        {/* E/W Arrows */}
        <polygon points="42,0 8,6 14,0 8,-6" fill="#7a552b" />
        <polygon points="-42,0 -8,6 -14,0 -8,-6" fill="#7a552b" />
        {/* Labels */}
        <text x="0" y="-48" textAnchor="middle" fontSize="11" fontWeight="900" fill="#4a280e" fontFamily="Cinzel, serif">N</text>
        <text x="0" y="56" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7a552b" fontFamily="Cinzel, serif">S</text>
        <text x="50" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7a552b" fontFamily="Cinzel, serif">E</text>
        <text x="-50" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7a552b" fontFamily="Cinzel, serif">W</text>
      </g>

      {/* ── 8. ORNATE MAP BORDER & FILIGREE (Dark Leather & Gold Trim) ─────── */}
      {/* Outer Border Frame */}
      <rect x="8" y="8" width={W-16} height={H-16} fill="none" stroke="#4a2e16" strokeWidth="3" rx="4" />
      <rect x="14" y="14" width={W-28} height={H-28} fill="none" stroke="#c49339" strokeWidth="1.2" rx="3" />
      <rect x="18" y="18" width={W-36} height={H-36} fill="none" stroke="#7a552b" strokeWidth="0.8" rx="2" />

      {/* Corner Filigree Rosettes */}
      {[[22,22], [W-22,22], [22,H-22], [W-22,H-22]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <circle r="7" fill="#e6d3a8" stroke="#4a2e16" strokeWidth="1.2" />
          <circle r="4" fill="#c49339" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#4a2e16" strokeWidth="1" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#4a2e16" strokeWidth="1" />
        </g>
      ))}

      {/* ── 9. DUST & EDGE VIGNETTE ────────────────────────────────────────── */}
      <rect width={W} height={H} fill="url(#burntEdgeVig)" />
    </g>
  );
}