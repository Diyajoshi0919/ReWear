import React, { useEffect, useState } from "react";
import axios from "axios";

const MyListings = () => {
  const [myItems, setMyItems] = useState([]);
  const [mySwaps, setMySwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Decode JWT to extract userId
  const getUserId = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  // FETCH MY ITEMS
  const fetchMyItems = async () => {
    try {
      const res = await axios.get("https://rewearserverlatest.onrender.com/api/items");
      const allItems = Array.isArray(res.data) ? res.data : res.data.items;

      const mine = allItems.filter((item) => item?.uploader?._id === userId);
      setMyItems(mine);
    } catch (error) {
      console.error("❌ Error fetching items:", error);
    }
  };

  // FETCH MY SWAPS
  const fetchMySwaps = async () => {
    try {
      const res = await axios.get(
        "https://rewearserverlatest.onrender.com/api/swaps",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const swaps = res.data;

      const filtered = swaps.filter((swap) => {
        const requesterId = String(swap?.requester?._id || "");
        const ownerId = String(swap?.owner?._id || "");
        const myId = String(userId);

        return requesterId === myId || ownerId === myId;
      });

      setMySwaps(filtered);
    } catch (error) {
      console.error("❌ Error fetching swaps:", error);
    }
  };

  // ACCEPT / REJECT HANDLER
  const handleSwapAction = async (swapId, action) => {
    try {
      await axios.post(
        "https://rewearserverlatest.onrender.com/api/swaps/respond",
        { swapId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Swap ${action}ed successfully`);
      fetchMySwaps();
    } catch (err) {
      console.error("❌ Swap action error:", err);
    }
  };

  useEffect(() => {
    fetchMyItems();
    fetchMySwaps();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <h2 className="text-center py-10 text-gray-500 text-lg">
        Loading your items & swaps...
      </h2>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-4 sm:px-6 md:px-10 py-10 font-sans">

      {/* MY LISTINGS */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] mb-6 text-center sm:text-left">
        📦 My Listings
      </h1>

      {myItems.length === 0 ? (
        <p className="text-gray-500 text-center">You haven't uploaded any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {myItems.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition flex flex-col items-center"
            >
              <img
                src={item?.images?.[0] || "https://via.placeholder.com/200x250?text=No+Image"}
                alt={item.title}
                className="w-40 sm:w-44 h-56 sm:h-60 object-cover rounded-xl"
              />

              <p className="text-lg font-semibold text-center mt-3">{item.title}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          ))}
        </div>
      )}

      {/* MY SWAPS */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] mt-12 mb-6 text-center sm:text-left">
        🔄 My Swap Requests
      </h1>

      {mySwaps.length === 0 ? (
        <p className="text-gray-500 text-center">No swap requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mySwaps.map((swap) => (
            <div
              key={swap._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Swap Request</h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold
                    ${
                      swap.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : swap.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {swap.status.toUpperCase()}
                </span>
              </div>

              {/* Offered Item */}
              <div className="mb-4">
                <p className="text-gray-700 font-semibold mb-1">Offered Item</p>
                <div className="flex gap-3 items-center">
                  <img
                    src={swap.offeredItem?.images?.[0] || "https://via.placeholder.com/80x80"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                    alt="Offered Item"
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-md">
                      {swap.offeredItem?.title || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {swap.offeredItem?.category || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requested Item */}
              <div className="mb-4">
                <p className="text-gray-700 font-semibold mb-1">Requested Item</p>
                <div className="flex gap-3 items-center">
                  <img
                    src={swap.requestedItem?.images?.[0] || "https://via.placeholder.com/80x80"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                    alt="Requested Item"
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-md">
                      {swap.requestedItem?.title || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {swap.requestedItem?.category || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="border-t pt-3 mt-3">
                <p className="text-gray-600 text-sm">
                  <strong>Requester:</strong> {swap.requester?.name || "Unknown"}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Owner:</strong> {swap.owner?.name || "Unknown"}
                </p>
              </div>

              {/* Accept / Reject Buttons */}
              {swap.owner?._id === userId && swap.status === "pending" && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleSwapAction(swap._id, "accept")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleSwapAction(swap._id, "reject")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
