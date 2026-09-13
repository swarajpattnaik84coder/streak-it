import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import SignupForm from "./components/auth/SignupForm.jsx";

/** Redirects unauthenticated users to /login */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/** Redirects already-authenticated users away from auth pages */
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — accessible only when NOT logged in */}
        <Route path="/login"  element={<PublicRoute><LoginForm  /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupForm /></PublicRoute>} />

        {/* Main app — protected, requires login */}
        <Route path="/*" element={<PrivateRoute><AppLayout /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}