import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";

const HomeLanding = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          "https://rewearserverlatest.onrender.com/api/items"
        );
        const data = Array.isArray(res.data) ? res.data : res.data.items;
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="bg-[#FDF4F2] min-h-screen font-sans text-[#2E2E2E]">

      {/* =========== HEADER (RESPONSIVE) =========== */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-3 shadow bg-white">

        {/* Logo + Text */}
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/ReWearLogo.png"
            alt="ReWear Logo"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
          />
          <h1 className="text-lg sm:text-xl font-bold text-[#D94F4F] mt-1">
            ReWear
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">

          <Link
            to="/browse-items"
            className="hover:underline flex items-center gap-1"
          >
            <Search size={16} className="sm:size-[18px]" /> 
            <span className="hidden sm:block">Browse</span>
          </Link>

          {!token ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-[#D94F4F] text-white px-3 sm:px-4 py-1 rounded-md hover:bg-[#bf3f3f] transition text-sm sm:text-base"
            >
              Logout
            </button>
          )}
        </nav>

      </header>

      {/* =========== HERO SECTION (RESPONSIVE) =========== */}
      <section className="text-center py-10 sm:py-16 bg-[#FFEFEF] px-4">

        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#D94F4F] tracking-wide">
          Swap Your Style, Sustainably 🌿
        </h2>

        <p className="max-w-xl mx-auto text-gray-600 text-base sm:text-lg mb-8 px-2">
          A community-driven platform to exchange fashion, reduce waste,  
          and embrace a more sustainable lifestyle.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-sm font-medium text-[#D94F4F] px-2">
          <span className="bg-white shadow rounded-full px-3 py-2 sm:px-4">
            ♻️ Sustainable Fashion
          </span>
          <span className="bg-white shadow rounded-full px-3 py-2 sm:px-4">
            👥 Community Driven
          </span>
          <span className="bg-white shadow rounded-full px-3 py-2 sm:px-4">
            🎁 Zero-Cost Swapping
          </span>
        </div>
      </section>

      {/* =========== COMMUNITY UPLOADS =========== */}
      <section className="px-4 sm:px-8 py-10">
        <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-center tracking-wide text-[#D94F4F]">
          Community Uploads
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">No items uploaded yet.</p>
        ) : (
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-5 
            gap-6 
            sm:gap-10 
            place-items-center
          ">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-3 sm:p-4 w-full max-w-[170px] flex flex-col items-center"
              >
                <img
                  src={
                    item.images?.[0] ||
                    "https://via.placeholder.com/200x250?text=No+Image"
                  }
                  alt={item.title}
                  className="w-32 h-44 sm:w-44 sm:h-60 object-cover rounded-xl"
                />

                <p className="text-base sm:text-lg font-semibold text-center mt-3 tracking-wide">
                  {item.title}
                </p>

                {item.category && (
                  <p className="text-xs sm:text-sm text-gray-500">{item.category}</p>
                )}

                {item.uploader && (
                  <p className="text-xs text-gray-400 mt-1">
                    Uploaded by: {item.uploader.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========== WHY REWEAR =========== */}
      <section className="bg-white px-4 sm:px-8 py-12 text-center">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Why ReWear?</h3>
        <p className="text-gray-600 max-w-xl mx-auto mb-6 text-sm sm:text-base">
          Over <strong>2,000+</strong> successful swaps, <strong>15kg</strong> of
          fabric saved, and a growing community of eco-conscious fashion lovers.
        </p>
      </section>

    </div>
  );
};

export default HomeLanding;
