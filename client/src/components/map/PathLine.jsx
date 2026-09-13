/**
 * SVG quadratic-bezier path connecting two level nodes.
 * Completed segments render as gold with a glow; future segments are dashed stone.
 */
export default function PathLine({ from, to, completed = false }) {
  const cx = (from.x + to.x) / 2;
  const cy = (from.y + to.y) / 2 - 14;
  const d  = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

  if (completed) {
    return (
      <>
        {/* Soft glow halo underneath */}
        <path
          d={d}
          fill="none"
          stroke="#c9a84c"
          strokeWidth={5}
          strokeOpacity={0.08}
          strokeLinecap="round"
          filter="url(#pathGlow)"
        />
        {/* Main gold line */}
        <path
          d={d}
          fill="none"
          stroke="#c9a84c"
          strokeWidth={2}
          strokeOpacity={0.75}
          strokeLinecap="round"
        />
      </>
    );
  }

  return (
    <path
      d={d}
      fill="none"
      stroke="#2a2535"
      strokeWidth={1.5}
      strokeOpacity={0.5}
      strokeLinecap="round"
      strokeDasharray="5 5"
    />
  );
}