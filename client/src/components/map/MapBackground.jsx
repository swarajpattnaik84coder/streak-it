import { MAP_CONFIG } from "../../data/mockData.js";

export default function MapBackground() {
  const { width: W, height: H } = MAP_CONFIG;

  return (
    <g className="select-none pointer-events-none">
      <defs>
        {/* Base land texture pattern */}
        <pattern id="landTexture" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#0f0e13" />
          <rect x="0" y="0" width="80" height="80" fill="#110e12" opacity="0.6" />
          <circle cx="20" cy="18" r="0.6" fill="#1a1624" />
          <circle cx="55" cy="40" r="0.8" fill="#181422" />
          <circle cx="38" cy="65" r="0.5" fill="#15111e" />
          <circle cx="72" cy="12" r="0.7" fill="#181422" />
        </pattern>

        {/* Aged parchment overlay */}
        <pattern id="ageNoise" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="none" />
          <circle cx="10"  cy="25"  r="1.2" fill="#1e1a28" opacity="0.4" />
          <circle cx="60"  cy="8"   r="0.8" fill="#1a1625" opacity="0.3" />
          <circle cx="95"  cy="55"  r="1.0" fill="#1e1a28" opacity="0.35" />
          <circle cx="30"  cy="90"  r="1.3" fill="#19152a" opacity="0.4" />
          <circle cx="85"  cy="100" r="0.7" fill="#1c1826" opacity="0.3" />
        </pattern>

        {/* Continent land mass gradient */}
        <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#151220" />
          <stop offset="40%"  stopColor="#13101a" />
          <stop offset="75%"  stopColor="#110e16" />
          <stop offset="100%" stopColor="#0c0a12" />
        </linearGradient>

        {/* Mountain range gradient — layered peaks */}
        <linearGradient id="mtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#2a2440" />
          <stop offset="45%"  stopColor="#1e1930" />
          <stop offset="100%" stopColor="#131120" />
        </linearGradient>
        <linearGradient id="mtnShade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#0a091a" stopOpacity="0.7" />
          <stop offset="50%"  stopColor="#0a091a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a091a" stopOpacity="0.5" />
        </linearGradient>

        {/* River gradient — subtle water blue-dark */}
        <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0d1a2e" stopOpacity="0.9" />
          <stop offset="50%"  stopColor="#0a1626" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0d1a2e" stopOpacity="0.9" />
        </linearGradient>

        {/* Ocean gradient — deep dark water */}
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#060a14" />
          <stop offset="100%" stopColor="#040608" />
        </linearGradient>

        {/* Forest fill */}
        <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0e1c12" />
          <stop offset="100%" stopColor="#091209" />
        </linearGradient>

        {/* Regional tint gradients */}
        <radialGradient id="ashlandsGlow" cx="25%" cy="60%" r="25%">
          <stop offset="0%" stopColor="#3d1a08" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3d1a08" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="stonemarkGlow" cx="50%" cy="50%" r="25%">
          <stop offset="0%" stopColor="#1a1530" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1a1530" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="citadelGlow" cx="90%" cy="35%" r="20%">
          <stop offset="0%" stopColor="#302008" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#302008" stopOpacity="0" />
        </radialGradient>

        {/* Vignette for map edges */}
        <radialGradient id="mapEdgeVig" cx="50%" cy="50%" r="65%">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0" />
          <stop offset="80%"  stopColor="#000000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.88" />
        </radialGradient>

        {/* Current-level region highlight */}
        <radialGradient id="currentRegionGlow" cx="34%" cy="50%" r="15%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── 1. BASE LAND ────────────────────────────────────────────────────── */}
      <rect width={W} height={H} fill="url(#landTexture)" />
      <rect width={W} height={H} fill="url(#landGrad)" opacity="0.7" />

      {/* ── 2. CONTINENT COASTLINE & OCEAN ─────────────────────────────────── */}
      {/* Main southern coast */}
      <path
        d={`M 0,${H*0.78} C 300,${H*0.82} 600,${H*0.75} 900,${H*0.80}
            S 1300,${H*0.73} 1600,${H*0.79} S 2000,${H*0.72} 2400,${H*0.77}
            S 2900,${H*0.72} ${W},${H*0.76} L ${W},${H} L 0,${H} Z`}
        fill="url(#oceanGrad)"
        stroke="#131a2e"
        strokeWidth="1.2"
      />
      {/* Secondary coastal inlet */}
      <path
        d={`M 800,${H} C 820,${H*0.88} 860,${H*0.85} 900,${H*0.80}`}
        fill="url(#oceanGrad)"
        stroke="#0e1828"
        strokeWidth="1"
      />

      {/* ── 3. REGIONAL COLOR OVERLAYS ──────────────────────────────────────── */}
      <rect width={W} height={H} fill="url(#ashlandsGlow)" />
      <rect width={W} height={H} fill="url(#stonemarkGlow)" />
      <rect width={W} height={H} fill="url(#citadelGlow)" />
      {/* Current player region subtle gold tint */}
      <rect width={W} height={H} fill="url(#currentRegionGlow)" />

      {/* ── 4. MOUNTAIN RANGES — multi-layer peaks ──────────────────────────── */}

      {/* Range 1: Ashlands Scorchback Ridge */}
      {/* Shadow layer (back mountains) */}
      <path
        d="M 50,195 L 85,145 L 115,190 L 150,130 L 195,188 L 240,125 L 290,192 L 345,118 L 400,188 L 450,130 L 500,195 Z"
        fill="#0e0c18" stroke="none"
      />
      {/* Main peaks */}
      <path
        d="M 60,200 L 95,140 L 130,195 L 160,122 L 205,190 L 250,118 L 305,195 L 360,110 L 415,195 L 468,128 L 520,198 Z"
        fill="url(#mtnGrad)" stroke="#22203a" strokeWidth="0.8"
      />
      {/* Snow caps */}
      <path d="M 95,140 L 100,148 L 90,148 Z" fill="#3a3560" opacity="0.6" />
      <path d="M 160,122 L 166,130 L 154,130 Z" fill="#3a3560" opacity="0.6" />
      <path d="M 250,118 L 257,128 L 243,128 Z" fill="#3a3560" opacity="0.6" />
      <path d="M 360,110 L 368,121 L 352,121 Z" fill="#3a3560" opacity="0.6" />
      {/* Side shadow */}
      <path
        d="M 60,200 L 95,140 L 130,195 L 160,122 L 205,190 L 250,118 L 305,195 L 360,110 L 415,195 L 468,128 L 520,198 Z"
        fill="url(#mtnShade)" opacity="0.5"
      />

      {/* Range 2: Stonemark Iron Spine */}
      <path
        d="M 870,205 L 920,118 L 975,195 L 1035,100 L 1095,188 L 1158,105 L 1228,192 L 1305,98 L 1378,200 L 1440,115 L 1510,205 Z"
        fill="#0e0c18" stroke="none"
      />
      <path
        d="M 880,210 L 930,112 L 990,200 L 1048,95 L 1110,192 L 1172,98 L 1245,198 L 1322,88 L 1398,205 L 1460,108 L 1530,210 Z"
        fill="url(#mtnGrad)" stroke="#22203a" strokeWidth="0.8"
      />
      <path d="M 930,112 L 938,122 L 922,122 Z" fill="#3a3560" opacity="0.55" />
      <path d="M 1048,95 L 1057,107 L 1039,107 Z" fill="#3a3560" opacity="0.55" />
      <path d="M 1172,98 L 1181,110 L 1163,110 Z" fill="#3a3560" opacity="0.55" />
      <path d="M 1322,88 L 1332,102 L 1312,102 Z" fill="#3a3560" opacity="0.55" />

      {/* Range 3: Ironveil Storm Peaks */}
      <path
        d="M 1700,185 L 1760,95 L 1830,178 L 1905,80 L 1980,172 L 2060,88 L 2140,180 L 2225,95 L 2310,185 Z"
        fill="#0b0a16" stroke="none"
      />
      <path
        d="M 1712,192 L 1774,85 L 1848,185 L 1920,70 L 1998,178 L 2078,78 L 2158,188 L 2248,82 L 2336,192 Z"
        fill="url(#mtnGrad)" stroke="#1e1c38" strokeWidth="0.9"
      />
      <path d="M 1774,85 L 1784,98 L 1764,98 Z" fill="#3f3b62" opacity="0.5" />
      <path d="M 1920,70 L 1931,84 L 1909,84 Z" fill="#3f3b62" opacity="0.5" />
      <path d="M 2078,78 L 2090,93 L 2066,93 Z" fill="#3f3b62" opacity="0.5" />
      <path d="M 2248,82 L 2260,97 L 2236,97 Z" fill="#3f3b62" opacity="0.5" />

      {/* Range 4: Citadel Crown — tallest, most dramatic */}
      <path
        d="M 2600,175 L 2678,75 L 2760,165 L 2845,55 L 2935,152 L 3025,48 L 3118,158 L 3215,58 L 3312,170 L 3408,65 L 3500,178 L 3550,200 Z"
        fill="#09081a" stroke="none"
      />
      <path
        d="M 2614,185 L 2696,60 L 2780,172 L 2870,40 L 2962,158 L 3055,32 L 3150,165 L 3250,42 L 3350,178 L 3448,52 L 3550,185 Z"
        fill="url(#mtnGrad)" stroke="#1c1a36" strokeWidth="1"
      />
      <path d="M 2696,60 L 2709,78 L 2683,78 Z" fill="#45406a" opacity="0.6" />
      <path d="M 2870,40 L 2885,60 L 2855,60 Z" fill="#45406a" opacity="0.65" />
      <path d="M 3055,32 L 3072,55 L 3038,55 Z" fill="#50498a" opacity="0.7" />
      <path d="M 3250,42 L 3268,64 L 3232,64 Z" fill="#45406a" opacity="0.65" />
      <path d="M 3448,52 L 3465,74 L 3431,74 Z" fill="#45406a" opacity="0.6" />

      {/* ── 5. FOREST REGIONS — grouped canopy clusters ─────────────────────── */}
      {/* Forest cluster positions: [cx, cy, scale] */}
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
          {/* Tree canopy — layered triangles */}
          <polygon points="0,-14 8,0 -8,0"  fill="#0d1b10" stroke="#152418" strokeWidth="0.7" />
          <polygon points="0,-20 6,-8 -6,-8" fill="#0f2014" stroke="#152418" strokeWidth="0.6" />
          <rect x="-1.5" y="0" width="3" height="5" fill="#0a1208" />
        </g>
      ))}

      {/* ── 6. RIVERS & WATERWAYS ──────────────────────────────────────────── */}
      {/* River 1: Ashwash River (south through Ashlands) */}
      <path
        d="M 490,0 C 510,80 480,180 510,280 S 560,380 640,450"
        fill="none" stroke="url(#riverGrad)" strokeWidth="4" strokeLinecap="round"
      />
      {/* River 1 tributary */}
      <path
        d="M 490,0 C 505,60 495,140 510,280"
        fill="none" stroke="#0e1a2c" strokeWidth="2" strokeLinecap="round" opacity="0.6"
      />

      {/* River 2: Iron Throat (Stonemark) */}
      <path
        d="M 1340,0 C 1360,100 1330,210 1368,320 S 1440,410 1510,460"
        fill="none" stroke="url(#riverGrad)" strokeWidth="3.5" strokeLinecap="round"
      />

      {/* River 3: Ghostvein River (Ironveil) */}
      <path
        d="M 2190,0 C 2215,130 2200,250 2230,370 S 2320,438 2400,470"
        fill="none" stroke="url(#riverGrad)" strokeWidth="3" strokeLinecap="round"
      />

      {/* River delta / estuary at coastline */}
      <path
        d="M 640,450 C 660,475 680,490 695,510"
        fill="none" stroke="#0d1828" strokeWidth="2.5" strokeLinecap="round"
      />
      <path
        d="M 640,450 C 645,480 635,500 625,520"
        fill="none" stroke="#0d1828" strokeWidth="1.8" strokeLinecap="round"
      />

      {/* ── 7. ROADS & ANCIENT TRAILS ──────────────────────────────────────── */}
      {/* The great road — very faint ancient path connecting level zones */}
      <path
        d="M 140,455 C 200,400 280,380 310,390 C 380,370 420,310 480,305
           C 560,295 600,340 640,440 C 680,490 720,470 760,450
           C 820,430 900,450 990,450 C 1050,450 1100,400 1160,270
           C 1200,200 1250,220 1340,320 C 1400,380 1430,420 1520,430
           C 1600,440 1680,380 1680,380 C 1720,360 1800,395 1870,460"
        fill="none"
        stroke="#2a2338"
        strokeWidth="1.8"
        strokeDasharray="6 4"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* ── 8. DECORATIVE CARTOGRAPHY ──────────────────────────────────────── */}

      {/* Compass Rose — restrained, placed in open water/sky area */}
      <g transform="translate(672, 105)" opacity="0.4">
        <circle cx="0" cy="0" r="30" fill="none" stroke="#b89440" strokeWidth="0.75" />
        <circle cx="0" cy="0" r="24" fill="none" stroke="#8a6c24" strokeWidth="0.5" strokeDasharray="3 4" />
        {/* N pointer */}
        <polygon points="0,-36 5,-7 0,-12 -5,-7" fill="#c9a84c" />
        <polygon points="0,-36 -5,-7 0,-12" fill="#8a6c24" />
        {/* S pointer */}
        <polygon points="0,36 5,7 0,12 -5,7" fill="#7a5c20" />
        {/* E/W pointers */}
        <polygon points="36,0 7,5 12,0 7,-5" fill="#7a5c20" />
        <polygon points="-36,0 -7,5 -12,0 -7,-5" fill="#7a5c20" />
        {/* Cardinal letters */}
        <text x="0" y="-42" textAnchor="middle" fontSize="9" fontWeight="700" fill="#c9a84c" fontFamily="Cinzel, serif">N</text>
        <text x="0" y="50"  textAnchor="middle" fontSize="7" fill="#7a6030" fontFamily="Cinzel, serif">S</text>
        <text x="44" y="3"  textAnchor="middle" fontSize="7" fill="#7a6030" fontFamily="Cinzel, serif">E</text>
        <text x="-44" y="3" textAnchor="middle" fontSize="7" fill="#7a6030" fontFamily="Cinzel, serif">W</text>
      </g>

      {/* Decorative border frame — double line */}
      <rect x="10" y="10" width={W-20} height={H-20} fill="none" stroke="#24213a" strokeWidth="1.5" rx="3" />
      <rect x="16" y="16" width={W-32} height={H-32} fill="none" stroke="#1a1828" strokeWidth="0.75" rx="2" />

      {/* Corner ornaments */}
      {[[20,20], [W-20,20], [20,H-20], [W-20,H-20]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <circle r="5" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.4" />
          <circle r="2" fill="#c9a84c" opacity="0.25" />
          <line x1="-10" y1="0" x2="-6" y2="0" stroke="#c9a84c" strokeWidth="0.6" opacity="0.3" />
          <line x1="10"  y1="0" x2="6"  y2="0" stroke="#c9a84c" strokeWidth="0.6" opacity="0.3" />
          <line x1="0" y1="-10" x2="0" y2="-6" stroke="#c9a84c" strokeWidth="0.6" opacity="0.3" />
          <line x1="0" y1="10"  x2="0" y2="6"  stroke="#c9a84c" strokeWidth="0.6" opacity="0.3" />
        </g>
      ))}

      {/* "Here Be Dragons" sea marker */}
      <g transform="translate(2680, 528)" opacity="0.22">
        <path d="M 0,0 Q 25,-18 50,0 T 100,0 Q 120,-15 140,0" fill="none" stroke="#c9a84c" strokeWidth="1.2" />
        <text x="70" y="18" textAnchor="middle" fontSize="8" fontStyle="italic" fill="#8a6c24" fontFamily="Crimson Text, serif">Here be Serpents</text>
      </g>

      {/* Aged noise overlay */}
      <rect width={W} height={H} fill="url(#ageNoise)" opacity="0.6" />

      {/* ── 9. EDGE VIGNETTE — darkens all four edges ───────────────────────── */}
      <rect width={W} height={H} fill="url(#mapEdgeVig)" />
    </g>
  );
}