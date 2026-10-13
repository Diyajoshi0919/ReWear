import React, { useState } from "react";
import API, { errorMessage } from "../api/axios";
import { setToken } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", form);
      // The user is logged in right after signing up
      setToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF4F2] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#D94F4F]">Create Account</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="name" required autoComplete="name" placeholder="Full name" className="w-full p-2 border rounded-md" value={form.name} onChange={handleChange} />
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="w-full p-2 border rounded-md" value={form.email} onChange={handleChange} />
          <input name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="Password (6+ characters)" className="w-full p-2 border rounded-md" value={form.password} onChange={handleChange} />
          <button type="submit" disabled={loading} className="w-full bg-[#D94F4F] text-white py-2 rounded-md hover:bg-[#bf3f3f] disabled:bg-gray-400">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-[#D94F4F] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
