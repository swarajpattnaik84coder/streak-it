import { useState } from "react";

const inputClass = `
  w-full px-3 py-2.5 rounded text-sm text-stone-100
  bg-[#0f0d1e] border border-[#2a2644]
  focus:outline-none focus:border-amber-500/70 focus:bg-[#121028]
  transition-colors placeholder:text-stone-700
  disabled:opacity-50 disabled:cursor-not-allowed
`.trim();

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  autoFocus = false,
  disabled = false,
  error,
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-cinzel text-rpg-muted mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          className={[inputClass, error ? "border-red-700/70" : "", "pr-10"].join(" ")}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-rpg-muted hover:text-stone-300 transition-colors text-[11px] font-cinzel tracking-wide"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </div>
      {error && <p className="mt-1 text-[10px] text-red-400">{error}</p>}
    </div>
  );
}