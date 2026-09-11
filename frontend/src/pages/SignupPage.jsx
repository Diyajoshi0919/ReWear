import React, { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF4F2]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#D94F4F]">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" className="w-full p-2 border rounded-md" onChange={handleChange} />
          <input name="email" type="email" placeholder="you@example.com" className="w-full p-2 border rounded-md" onChange={handleChange} />
          <input name="password" type="password" placeholder="••••••••" className="w-full p-2 border rounded-md" onChange={handleChange} />
          <button type="submit" className="w-full bg-[#D94F4F] text-white py-2 rounded-md hover:bg-[#bf3f3f]">Sign Up</button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-[#D94F4F] hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
