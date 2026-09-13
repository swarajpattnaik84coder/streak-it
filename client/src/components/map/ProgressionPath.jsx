/**
 * Renders a bezier curve progression path between level nodes on the old map.
 * Completed & active: warm glowing golden compass ribbon thread.
 */
export default function ProgressionPath({ from, to, completed = false }) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 + (from.id % 2 === 0 ? -38 : 38);
  const d  = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;

  if (completed) {
    return (
      <g>
        {/* Dark road bed underlay */}
        <path d={d} fill="none" stroke="#2b1a0c" strokeWidth="9" strokeLinecap="round" opacity="0.8" />
        {/* Burnt umber leather edge */}
        <path d={d} fill="none" stroke="#5c3c1b" strokeWidth="5.5" strokeLinecap="round" />
        {/* Bright gold ribbon surface */}
        <path d={d} fill="none" stroke="#f0c050" strokeWidth="3" strokeLinecap="round" />
        {/* Core white-gold highlight thread */}
        <path d={d} fill="none" stroke="#fff8d6" strokeWidth="1.2" strokeLinecap="round" />
        {/* Gold glow aura */}
        <path d={d} fill="none" stroke="#f0c050" strokeWidth="10" strokeLinecap="round"
          strokeOpacity="0.25" filter="url(#goldGlow)" />
      </g>
    );
  }

  return (
    <g>
      {/* Dark underlying trail */}
      <path d={d} fill="none" stroke="#2b1a0c" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      {/* Dotted gold trail hint */}
      <path d={d} fill="none" stroke="#c49339" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="6 6" strokeOpacity="0.75" />
    </g>
  );
}