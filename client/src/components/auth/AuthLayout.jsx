import { motion } from "framer-motion";

/**
 * Full-page wrapper for auth screens (login / signup).
 * Uses the existing dark fantasy theme without introducing new design.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(160deg, #07070e 0%, #0c0b18 60%, #07070e 100%)" }}
    >
      {/* Subtle corner decorations inherited from map aesthetic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-0 w-64 h-64 opacity-[0.04]"
          style={{ background: "radial-gradient(circle at top left, #c9a84c, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.04]"
          style={{ background: "radial-gradient(circle at bottom right, #c9a84c, transparent 70%)" }} />
      </div>

      {/* Logo */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-2xl font-cinzel font-bold tracking-widest uppercase">
          streak <span className="text-gold" style={{ textShadow: "0 0 16px rgba(201,168,76,0.5)" }}>it!</span>
        </span>
        <p className="text-[10px] text-rpg-muted font-cinzel tracking-[0.25em] uppercase mt-1">
          Life RPG
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div
          className="rounded-xl p-7 shadow-2xl"
          style={{
            background: "linear-gradient(180deg, #121024 0%, #0a0914 100%)",
            border: "1px solid #1f1d30",
            boxShadow: "0 0 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(201,168,76,0.05)",
          }}
        >
          {/* Page heading */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-rpg-muted mt-1.5 font-crimson italic">{subtitle}</p>
            )}
            {/* Gold divider */}
            <div className="divider-fantasy mt-4" />
          </div>

          {children}
        </div>
      </motion.div>

      {/* Footer */}
      <p className="mt-6 text-[10px] text-rpg-muted text-center font-cinzel tracking-wider">
        © streak it! · Life RPG
      </p>
    </div>
  );
}