import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[60vh] bg-[#FDF4F2] flex flex-col items-center justify-center px-4 text-center">
    <h1 className="text-3xl font-bold text-[#D94F4F] mb-3">Page not found</h1>
    <p className="text-gray-600 mb-6">This page doesn't exist or has moved.</p>
    <Link to="/" className="bg-[#D94F4F] text-white px-5 py-2 rounded-full hover:bg-[#bf3f3f]">
      Go to home
    </Link>
  </div>
);

export default NotFound;
