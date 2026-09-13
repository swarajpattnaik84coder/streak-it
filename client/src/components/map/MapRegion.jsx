import { REGIONS } from "../../data/mockData.js";

const REGION_POSITIONS = [
  { id: "ashlands",    x: 480,  y: 530, opacity: 0.45 },
  { id: "stonemark",   x: 1350, y: 520, opacity: 0.45 },
  { id: "ironveil",    x: 2150, y: 520, opacity: 0.45 },
  { id: "grimholt",    x: 2950, y: 520, opacity: 0.45 },
  { id: "citadel",     x: 3380, y: 140, opacity: 0.50 },
];

/**
 * Renders calligraphic territory markers and banners floating over geography.
 */
export default function MapRegion() {
  return (
    <g className="select-none pointer-events-none">
      {REGION_POSITIONS.map((pos) => {
        const reg = REGIONS.find((r) => r.id === pos.id);
        if (!reg) return null;

        return (
          <g key={pos.id} transform={`translate(${pos.x}, ${pos.y})`}>
            {/* Banner background ribbon */}
            <rect
              x="-80"
              y="-14"
              width="160"
              height="24"
              rx="4"
              fill="#080812"
              fillOpacity="0.65"
              stroke="#2a253b"
              strokeWidth="1"
            />
            {/* Calligraphic territory text */}
            <text
              x="0"
              y="2"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fontWeight="700"
              letterSpacing="3.5"
              fill="#c9a84c"
              fillOpacity={pos.opacity + 0.3}
              fontFamily="Cinzel, serif"
            >
              {reg.name.toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}