import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, register, demoLogin, loading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      const res = await register(username, email, password);
      if (res.success) onClose();
      else setError(res.message);
    } else {
      const res = await login(email, password);
      if (res.success) onClose();
      else setError(res.message);
    }
  };

  const handleDemo = async () => {
    setError("");
    await demoLogin();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-6 rounded-xl border border-rpg bg-[#0d0c18] shadow-2xl text-stone-100"
          style={{ background: "linear-gradient(180deg, #121024 0%, #0a0914 100%)" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-rpg-muted hover:text-stone-300 text-xl font-bold"
          >
            ×
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase">
              {isSignUp ? "Join the Realm" : "Adventurer Login"}
            </h2>
            <p className="text-xs text-rpg-muted mt-1 font-crimson">
              {isSignUp ? "Create your character and begin your quest" : "Enter your credentials to continue your journey"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded bg-red-950/60 border border-red-800/60 text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                  Hero Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ShadowWarden"
                  className="w-full px-3 py-2 rounded bg-[#16142a] border border-[#2a2644] text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@realm.io"
                className="w-full px-3 py-2 rounded bg-[#16142a] border border-[#2a2644] text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-cinzel text-rpg-muted mb-1 uppercase tracking-wider">
                Secret Passcode
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded bg-[#16142a] border border-[#2a2644] text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-900 font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-98"
            >
              {loading ? "Processing..." : isSignUp ? "Create Character" : "Enter Realm"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#2a2644]" />
            <span className="text-[10px] font-cinzel text-rpg-muted uppercase">OR</span>
            <div className="flex-1 h-px bg-[#2a2644]" />
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemo}
            type="button"
            className="w-full py-2 rounded bg-stone-900 border border-amber-500/40 hover:bg-amber-950/40 text-amber-400 font-cinzel font-semibold text-xs tracking-wider uppercase transition-all"
          >
            ⚡ Play Instantly (Demo Mode)
          </button>

          {/* Toggle Sign Up / Login */}
          <div className="mt-4 text-center text-xs text-rpg-muted">
            {isSignUp ? "Already have an account?" : "New to the realm?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-400 font-medium hover:underline ml-1 font-cinzel"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
