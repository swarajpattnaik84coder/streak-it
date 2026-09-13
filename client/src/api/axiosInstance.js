import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "/api";

// If a full URL is provided without /api, append it so all /auth, /tasks endpoints match Express routes
if (baseURL.startsWith("http") && !baseURL.replace(/\/+$/, "").endsWith("/api")) {
  baseURL = baseURL.replace(/\/+$/, "") + "/api";
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;