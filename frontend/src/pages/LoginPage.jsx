import React, { useState } from "react";
import API, { errorMessage } from "../api/axios";
import { setToken } from "../utils/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If the user was sent here from a protected page, go back there after login
  const redirectTo = location.state?.from || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      setToken(res.data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF4F2] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#D94F4F]">Login to ReWear</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="w-full p-2 border rounded-md" value={form.email} onChange={handleChange} />
          <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className="w-full p-2 border rounded-md" value={form.password} onChange={handleChange} />
          <button type="submit" disabled={loading} className="w-full bg-[#D94F4F] text-white py-2 rounded-md hover:bg-[#bf3f3f] disabled:bg-gray-400">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account? <Link to="/signup" className="text-[#D94F4F] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
