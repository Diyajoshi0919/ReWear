import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF4F2]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#D94F4F]">Login to ReWear</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="you@example.com" className="w-full p-2 border rounded-md" onChange={handleChange} />
          <input name="password" type="password" placeholder="••••••••" className="w-full p-2 border rounded-md" onChange={handleChange} />
          <button type="submit" className="w-full bg-[#D94F4F] text-white py-2 rounded-md hover:bg-[#bf3f3f]">Login</button>
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account? <Link to="/signup" className="text-[#D94F4F] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
   