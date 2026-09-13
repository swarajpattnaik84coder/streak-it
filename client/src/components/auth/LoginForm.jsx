import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthLayout from "./AuthLayout.jsx";
import PasswordField from "./PasswordField.jsx";

const inputClass = `
  w-full px-3 py-2.5 rounded text-sm text-stone-100
  bg-[#0f0d1e] border border-[#2a2644]
  focus:outline-none focus:border-amber-500/70 focus:bg-[#121028]
  transition-colors placeholder:text-stone-700
  disabled:opacity-50 disabled:cursor-not-allowed
`.trim();

// ── Validation ────────────────────────────────────────────────────────────────
function validate(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  return errors;
}

// ── Submit states: idle | submitting | success | error ────────────────────────
export default function LoginForm() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [email,       setEmail      ] = useState("");
  const [password,    setPassword   ] = useState("");
  const [rememberMe,  setRememberMe ] = useState(false);
  const [errors,      setErrors     ] = useState({});
  const [apiError,    setApiError   ] = useState("");
  const [status,      setStatus     ] = useState("idle"); // idle | submitting | success

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setStatus("submitting");

    const res = await login(email, password);

    if (res.success) {
      setStatus("success");
      if (rememberMe) localStorage.setItem("streak_remember", "true");
      navigate("/", { replace: true });
    } else {
      setStatus("idle");
      setApiError(res.message || "Invalid credentials. Please try again.");
    }
  };

  const handleDemo = async () => {
    if (status === "submitting") return;
    setStatus("submitting");
    setApiError("");
    await demoLogin();
    setStatus("idle");
    navigate("/", { replace: true });
  };

  const isSubmitting = status === "submitting";

  return (
    <AuthLayout
      title="Adventurer Login"
      subtitle="Enter your credentials to continue your journey"
    >
      {/* API / server error */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-3 py-2.5 rounded bg-red-950/60 border border-red-800/50 text-red-400 text-xs text-center"
        >
          {apiError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-[10px] font-cinzel text-rpg-muted mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
            placeholder="adventurer@realm.io"
            autoComplete="email"
            autoFocus
            disabled={isSubmitting}
            className={[inputClass, errors.email ? "border-red-700/70" : ""].join(" ")}
          />
          {errors.email && <p className="mt-1 text-[10px] text-red-400">{errors.email}</p>}
        </div>

        {/* Password */}
        <PasswordField
          id="login-password"
          label="Secret Passcode"
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
          autoComplete="current-password"
          disabled={isSubmitting}
          error={errors.password}
        />

        {/* Remember me + Forgot password row */}
        <div className="flex items-center justify-between text-[10px]">
          <label className="flex items-center gap-2 cursor-pointer text-rpg-muted hover:text-stone-300 transition-colors select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
              className="w-3 h-3 accent-amber-500"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-amber-500/70 hover:text-amber-400 font-cinzel transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full py-2.5 rounded font-cinzel font-bold text-xs tracking-widest uppercase
            transition-all duration-200 active:scale-[0.98]
            bg-gradient-to-r from-amber-700 to-amber-600
            hover:from-amber-600 hover:to-amber-500
            text-stone-900 shadow-gold-sm
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-amber-700 disabled:hover:to-amber-600"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-900 border-t-transparent animate-spin" />
              Entering Realm...
            </span>
          ) : "Enter Realm"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#2a2644]" />
        <span className="text-[10px] font-cinzel text-rpg-muted uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-[#2a2644]" />
      </div>

      {/* Demo play */}
      <button
        type="button"
        onClick={handleDemo}
        disabled={isSubmitting}
        className="w-full py-2.5 rounded border border-amber-500/30 bg-amber-950/20
          hover:bg-amber-950/40 hover:border-amber-500/50
          text-amber-400 font-cinzel font-semibold text-xs tracking-widest uppercase
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ⚡ Play Instantly (Demo Mode)
      </button>

      {/* Navigation to signup */}
      <p className="mt-5 text-center text-[11px] text-rpg-muted">
        New to the realm?{" "}
        <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-cinzel font-medium transition-colors">
          Create your character
        </Link>
      </p>
    </AuthLayout>
  );
}