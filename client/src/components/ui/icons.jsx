// Lightweight inline SVG icon components — no external icon library needed.
// All icons use a 24x24 viewBox and stroke-based rendering.

const iconProps = {
  width: 18, height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function CalendarIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <rect x="8" y="14" width="3" height="3" rx="0.5" />
    </svg>
  );
}

export function TrophyIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <path d="M8 21h8M12 17v4M7 4H5a2 2 0 000 4h2" />
      <path d="M17 4h2a2 2 0 010 4h-2" />
      <path d="M7 4h10v8a5 5 0 01-10 0V4z" />
    </svg>
  );
}

export function UserIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function VaultIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" fill={stroke} stroke="none" />
      <path d="M12 8v1M12 15v1M8 12h1M15 12h1" />
    </svg>
  );
}

export function StoreIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <path d="M6 2L3 8h18l-3-6H6z" />
      <path d="M3 8v12a2 2 0 002 2h14a2 2 0 002-2V8" />
      <path d="M9 12a3 3 0 006 0" />
    </svg>
  );
}

export function SettingsIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export function FlameIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <path d="M12 2c0 6-5 8-5 13a5 5 0 0010 0c0-5-5-7-5-13z" />
      <path d="M12 12c0 3-2 4-2 5.5a2 2 0 004 0C14 16 12 15 12 12z" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ZapIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function CoinsIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <circle cx="8" cy="8" r="5" />
      <path d="M15.3 5.3A5 5 0 1116 16H11" />
    </svg>
  );
}

export function MapIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg {...iconProps} width={size} height={size} stroke={stroke}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}