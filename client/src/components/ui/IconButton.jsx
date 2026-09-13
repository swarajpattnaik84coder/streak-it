import { forwardRef } from "react";

const IconButton = forwardRef(function IconButton(
  { children, label, active = false, onClick, className = "", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={[
        "relative flex flex-col items-center justify-center gap-1",
        "rounded-lg px-2 py-2.5 transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-amber-500/50",
        active
          ? "text-amber-400"
          : "text-stone-600 hover:text-stone-300",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* active left-edge indicator */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-amber-400" />
      )}
      {children}
    </button>
  );
});

export default IconButton;