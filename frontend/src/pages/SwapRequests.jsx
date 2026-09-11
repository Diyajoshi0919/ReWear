import React, { useEffect, useState } from "react";
import axios from "axios";

const SwapRequests = () => {
  const [myItems, setMyItems] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [offered, setOffered] = useState("");
  const [requested, setRequested] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const getUserId = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  const fetchItems = async () => {
    try {
      const res = await axios.get("https://rewearserverlatest.onrender.com/api/items");
      const items = Array.isArray(res.data) ? res.data : res.data.items;

      const mine = items.filter((item) => item.uploader?._id === userId);
      const others = items.filter((item) => item.uploader?._id !== userId);

      setMyItems(mine);
      setOtherItems(others);
    } catch (err) {
      console.error("Error loading items:", err);
    }
  };

  const createSwap = async (e) => {
    e.preventDefault();

    if (!offered || !requested) {
      setMessage("Please select both items.");
      return;
    }

    try {
      await axios.post(
        "https://rewearserverlatest.onrender.com/api/swaps/request",
        {
          offeredItemId: offered,
          requestedItemId: requested,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Swap request created successfully!");
      setOffered("");
      setRequested("");
    } catch (err) {
      console.error("Swap Error:", err);
      setMessage("Failed to create swap request.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF4F2] px-3 py-4 sm:px-6 sm:py-10 font-sans text-[#2E2E2E]">

      <div className="max-w-lg sm:max-w-xl md:max-w-2xl mx-auto 
                      bg-white p-5 sm:p-8 rounded-2xl shadow-xl mb-4">

        <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] 
                       mb-4 sm:mb-6 text-center">
          🔁 Create Swap Request
        </h1>

        {message && (
          <p className="text-center mb-3 sm:mb-4 font-medium text-[#D94F4F] text-sm sm:text-base">
            {message}
          </p>
        )}

        <form onSubmit={createSwap} className="space-y-5 sm:space-y-6">

          {/* Offered Item */}
          <div>
            <label className="text-base sm:text-lg font-semibold block mb-1 sm:mb-2">
              Your Offered Item
            </label>

            <select
              value={offered}
              onChange={(e) => setOffered(e.target.value)}
              className="w-full p-3 rounded-xl border text-sm sm:text-base border-gray-300 bg-[#FFF8F6] focus:ring-2 focus:ring-[#D94F4F]"
            >
              <option value="">-- Select Your Item --</option>
              {myItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {/* Requested Item */}
          <div>
            <label className="text-base sm:text-lg font-semibold block mb-1 sm:mb-2">
              Requested Item from Community
            </label>

            <select
              value={requested}
              onChange={(e) => setRequested(e.target.value)}
              className="w-full p-3 rounded-xl border text-sm sm:text-base border-gray-300 bg-[#FFF8F6] focus:ring-2 focus:ring-[#D94F4F]"
            >
              <option value="">-- Select Requested Item --</option>
              {otherItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#D94F4F] text-white py-3 rounded-full 
                       text-base sm:text-lg font-semibold hover:bg-[#bf3f3f] transition"
          >
            Send Swap Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwapRequests;
