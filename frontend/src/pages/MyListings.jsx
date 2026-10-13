import React, { useEffect, useState } from "react";
import API, { errorMessage } from "../api/axios";
import { getUserId } from "../utils/auth";

const statusStyles = {
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-800",
};

const MyListings = () => {
  const [myItems, setMyItems] = useState([]);
  const [mySwaps, setMySwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const userId = getUserId();

  // The server returns only this user's items and swaps
  const loadData = async () => {
    try {
      const [itemsRes, swapsRes] = await Promise.all([API.get("/items/mine"), API.get("/swaps")]);
      setMyItems(itemsRes.data);
      setMySwaps(swapsRes.data);
      setError("");
    } catch (err) {
      setError(errorMessage(err, "Couldn't load your listings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSwapAction = async (swapId, action) => {
    setBusyId(swapId);
    try {
      await API.post("/swaps/respond", { swapId, action });
      await loadData(); // refresh both lists, since accepting changes item status
    } catch (err) {
      alert(errorMessage(err, "Couldn't update the swap"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    setBusyId(itemId);
    try {
      await API.delete(`/items/${itemId}`);
      await loadData();
    } catch (err) {
      alert(errorMessage(err, "Couldn't delete the item"));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <h2 className="text-center py-10 text-gray-500 text-lg">Loading your items and swaps...</h2>;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-4 sm:px-6 md:px-10 py-10 font-sans">
      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      {/* MY LISTINGS */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] mb-6 text-center sm:text-left">
        📦 My Listings
      </h1>

      {myItems.length === 0 ? (
        <p className="text-gray-500 text-center">You haven't uploaded any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {myItems.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition flex flex-col items-center"
            >
              <img
                src={item.images?.[0] || "/placeholder.svg"}
                alt={item.title}
                loading="lazy"
                className="w-40 sm:w-44 h-56 sm:h-60 object-cover rounded-xl"
              />
              <p className="text-lg font-semibold text-center mt-3">{item.title}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
              <span className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${
                item.status === "swapped" ? "bg-gray-200 text-gray-600" : "bg-green-100 text-green-700"
              }`}>
                {item.status === "swapped" ? "Swapped" : "Available"}
              </span>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={busyId === item._id}
                className="mt-3 text-sm text-red-600 hover:underline disabled:text-gray-400"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MY SWAPS */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] mt-12 mb-6 text-center sm:text-left">
        🔄 My Swap Requests
      </h1>

      {mySwaps.length === 0 ? (
        <p className="text-gray-500 text-center">No swap requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mySwaps.map((swap) => {
            const iAmOwner = swap.owner?._id === userId;
            const otherPerson = iAmOwner ? swap.requester : swap.owner;

            return (
              <div key={swap._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {iAmOwner ? "Request received" : "Request sent"}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${statusStyles[swap.status]}`}>
                    {swap.status}
                  </span>
                </div>

                {[
                  { label: "Offered item", item: swap.offeredItem },
                  { label: "Requested item", item: swap.requestedItem },
                ].map(({ label, item }) => (
                  <div className="mb-4" key={label}>
                    <p className="text-gray-700 font-semibold mb-1">{label}</p>
                    <div className="flex gap-3 items-center">
                      <img
                        src={item?.images?.[0] || "/placeholder.svg"}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                        alt={item?.title || label}
                      />
                      <div>
                        <p className="font-medium text-sm sm:text-base">{item?.title || "Item deleted"}</p>
                        <p className="text-sm text-gray-500">{item?.category || ""}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3">
                  <p className="text-gray-600 text-sm">
                    <strong>{iAmOwner ? "From" : "To"}:</strong> {otherPerson?.name || "Unknown"}
                  </p>
                  {/* Contact details appear only once both sides have agreed */}
                  {swap.status === "accepted" && otherPerson?.email && (
                    <p className="text-gray-600 text-sm">
                      <strong>Contact:</strong>{" "}
                      <a href={`mailto:${otherPerson.email}`} className="text-[#D94F4F] hover:underline">
                        {otherPerson.email}
                      </a>
                    </p>
                  )}
                </div>

                {iAmOwner && swap.status === "pending" && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleSwapAction(swap._id, "accept")}
                      disabled={busyId === swap._id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleSwapAction(swap._id, "reject")}
                      disabled={busyId === swap._id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyListings;
