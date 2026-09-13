/**
 * Renders a bezier curve segment of the progression path between two level nodes.
 * Completed: multi-layer illuminated ancient road.
 * Locked:    dark dotted trail hint.
 */
export default function ProgressionPath({ from, to, completed = false }) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 + (from.id % 2 === 0 ? -38 : 38);
  const d  = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;

  if (completed) {
    return (
      <g>
        {/* Wide dark road bed */}
        <path d={d} fill="none" stroke="#1a1408" strokeWidth="8" strokeLinecap="round" />
        {/* Earthy center track */}
        <path d={d} fill="none" stroke="#3a2c10" strokeWidth="4.5" strokeLinecap="round" />
        {/* Gold illumination surface */}
        <path d={d} fill="none" stroke="#a07828" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bright highlight thread */}
        <path d={d} fill="none" stroke="#d4a040" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
        {/* Subtle glow aura */}
        <path d={d} fill="none" stroke="#c9a84c" strokeWidth="6" strokeLinecap="round"
          strokeOpacity="0.08" filter="url(#pathGlow)" />
      </g>
    );
  }

  return (
    <g>
      {/* Dark underlying track */}
      <path d={d} fill="none" stroke="#100e1c" strokeWidth="4" strokeLinecap="round" />
      {/* Faint dotted hint */}
      <path d={d} fill="none" stroke="#2e2a48" strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray="5 6" strokeOpacity="0.6" />
    </g>
  );
}