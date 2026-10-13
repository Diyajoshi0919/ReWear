import axios from "axios";
import { getToken, clearToken } from "../utils/auth";

// Set VITE_API_URL in frontend/.env (locally) and in Vercel's Environment Variables (production).
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000, // Render's free tier can take ~50s to wake up
});

// Attach the JWT to every request automatically
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is expired or invalid, log the user out
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Turn an axios error into a message a user can read
export const errorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  if (err.code === "ECONNABORTED") return "The server is taking too long to respond. Please try again.";
  if (!err.response) return "Can't reach the server. Check your connection and try again.";
  return err.response.data?.message || fallback;
};

export default API;
