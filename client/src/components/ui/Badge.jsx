const VARIANTS = {
  default: "bg-stone-800/80 text-stone-300 border-stone-700/60",
  gold:    "bg-amber-950/60 text-amber-400 border-amber-700/50",
  green:   "bg-green-950/60 text-green-400 border-green-800/50",
  red:     "bg-red-950/60   text-red-400   border-red-800/50",
  purple:  "bg-purple-950/60 text-purple-400 border-purple-800/50",
  blue:    "bg-blue-950/60  text-blue-400  border-blue-800/50",
};
const SIZES = {
  xs: "px-1.5 py-0.5 text-[9px]",
  sm: "px-2   py-0.5 text-[10px]",
  md: "px-2.5 py-1   text-xs",
};

export default function Badge({ children, variant = "default", size = "sm", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded border font-semibold tracking-wide",
        VARIANTS[variant] ?? VARIANTS.default,
        SIZES[size]       ?? SIZES.sm,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}