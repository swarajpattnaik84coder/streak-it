import { SEGMENTS, MAP_CONFIG } from "../../data/mockData.js";

/**
 * Visual map segment dividers marking 5-level territory boundaries.
 */
export default function MapSegment() {
  const { height: H } = MAP_CONFIG;

  return (
    <g className="select-none pointer-events-none">
      {SEGMENTS.slice(0, -1).map((seg) => {
        const xDivider = seg.id * 850 + 50;

        return (
          <g key={seg.id} transform={`translate(${xDivider}, 0)`}>
            {/* Vertical dashed territory boundary line */}
            <line
              x1="0"
              y1="40"
              x2="0"
              y2={H - 40}
              stroke="#252136"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.6"
            />
            {/* Segment boundary emblem badge */}
            <circle cx="0" cy="40" r="10" fill="#080812" stroke="#252136" strokeWidth="1" />
            <text
              x="0"
              y="40"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fontWeight="bold"
              fill="#c9a84c"
              fillOpacity="0.5"
              fontFamily="Cinzel, serif"
            >
              {seg.id}
            </text>
          </g>
        );
      })}
    </g>
  );
}