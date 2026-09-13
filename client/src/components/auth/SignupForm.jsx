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
function validate(characterName, email, password, confirmPassword) {
  const errors = {};
  if (!characterName.trim()) errors.characterName = "Hero name is required.";
  else if (characterName.trim().length < 2) errors.characterName = "Must be at least 2 characters.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "Must be at least 6 characters.";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export default function SignupForm() {
  const navigate = useNavigate();
  const { register, demoLogin } = useAuth();

  const [characterName, setCharacterName] = useState("");
  const [email,         setEmail        ] = useState("");
  const [password,      setPassword     ] = useState("");
  const [confirmPw,     setConfirmPw    ] = useState("");
  const [errors,        setErrors       ] = useState({});
  const [apiError,      setApiError     ] = useState("");
  const [status,        setStatus       ] = useState("idle"); // idle | submitting | success

  const clearFieldError = (field) => setErrors(p => ({ ...p, [field]: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const validationErrors = validate(characterName, email, password, confirmPw);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setStatus("submitting");

    const res = await register(characterName.trim(), email, password);

    if (res.success) {
      setStatus("success");
      navigate("/", { replace: true });
    } else {
      setStatus("idle");
      setApiError(res.message || "Registration failed. Please try again.");
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
      title="Join the Realm"
      subtitle="Create your character and begin your quest"
    >
      {/* API error */}
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
        {/* Character name */}
        <div>
          <label htmlFor="signup-name" className="block text-[10px] font-cinzel text-rpg-muted mb-1.5 uppercase tracking-wider">
            Hero Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={characterName}
            onChange={e => { setCharacterName(e.target.value); clearFieldError("characterName"); }}
            placeholder="e.g. ShadowWarden"
            autoComplete="username"
            autoFocus
            disabled={isSubmitting}
            className={[inputClass, errors.characterName ? "border-red-700/70" : ""].join(" ")}
          />
          {errors.characterName && <p className="mt-1 text-[10px] text-red-400">{errors.characterName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-[10px] font-cinzel text-rpg-muted mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); clearFieldError("email"); }}
            placeholder="adventurer@realm.io"
            autoComplete="email"
            disabled={isSubmitting}
            className={[inputClass, errors.email ? "border-red-700/70" : ""].join(" ")}
          />
          {errors.email && <p className="mt-1 text-[10px] text-red-400">{errors.email}</p>}
        </div>

        {/* Password */}
        <PasswordField
          id="signup-password"
          label="Create Password"
          value={password}
          onChange={e => { setPassword(e.target.value); clearFieldError("password"); clearFieldError("confirmPassword"); }}
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.password}
        />

        {/* Confirm Password */}
        <PasswordField
          id="signup-confirm"
          label="Confirm Password"
          value={confirmPw}
          onChange={e => { setConfirmPw(e.target.value); clearFieldError("confirmPassword"); }}
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.confirmPassword}
        />

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
              Forging Character...
            </span>
          ) : "Create Character"}
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

      {/* Navigation to login */}
      <p className="mt-5 text-center text-[11px] text-rpg-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-amber-400 hover:text-amber-300 font-cinzel font-medium transition-colors">
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
}