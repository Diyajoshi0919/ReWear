import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { errorMessage } from "../api/axios";
import { getUserId } from "../utils/auth";

const SwapRequests = () => {
  const [myItems, setMyItems] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [offered, setOffered] = useState("");
  const [requested, setRequested] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // My own available items, and everyone's available items
        const [mineRes, allRes] = await Promise.all([API.get("/items/mine"), API.get("/items")]);
        setMyItems(mineRes.data.filter((item) => item.status === "available"));
        setOtherItems(allRes.data.filter((item) => item.uploader?._id !== userId));
      } catch (err) {
        setMessage({ text: errorMessage(err, "Couldn't load items"), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [userId]);

  const createSwap = async (e) => {
    e.preventDefault();

    if (!offered || !requested) {
      setMessage({ text: "Please select both items.", type: "error" });
      return;
    }

    setSending(true);
    try {
      await API.post("/swaps/request", { offeredItemId: offered, requestedItemId: requested });
      setMessage({ text: "Swap request sent. You can track it in My Listings.", type: "success" });
      setOffered("");
      setRequested("");
    } catch (err) {
      setMessage({ text: errorMessage(err, "Failed to send swap request"), type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF4F2] px-3 py-4 sm:px-6 sm:py-10 font-sans text-[#2E2E2E]">
      <div className="max-w-lg sm:max-w-xl md:max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-2xl shadow-xl mb-4">

        <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] mb-4 sm:mb-6 text-center">
          🔁 Create Swap Request
        </h1>

        {message.text && (
          <p className={`text-center mb-3 sm:mb-4 font-medium text-sm sm:text-base ${
            message.type === "success" ? "text-green-700" : "text-red-600"
          }`}>
            {message.text}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : myItems.length === 0 ? (
          <p className="text-center text-gray-600">
            You need at least one available item to offer.{" "}
            <Link to="/product-design" className="text-[#D94F4F] font-semibold hover:underline">
              Upload an item
            </Link>
          </p>
        ) : (
          <form onSubmit={createSwap} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="offered" className="text-base sm:text-lg font-semibold block mb-1 sm:mb-2">
                Your offered item
              </label>
              <select
                id="offered"
                value={offered}
                onChange={(e) => setOffered(e.target.value)}
                className="w-full p-3 rounded-xl border text-sm sm:text-base border-gray-300 bg-[#FFF8F6] focus:ring-2 focus:ring-[#D94F4F]"
              >
                <option value="">-- Select your item --</option>
                {myItems.map((item) => (
                  <option key={item._id} value={item._id}>{item.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="requested" className="text-base sm:text-lg font-semibold block mb-1 sm:mb-2">
                Item you want from the community
              </label>
              <select
                id="requested"
                value={requested}
                onChange={(e) => setRequested(e.target.value)}
                className="w-full p-3 rounded-xl border text-sm sm:text-base border-gray-300 bg-[#FFF8F6] focus:ring-2 focus:ring-[#D94F4F]"
              >
                <option value="">-- Select an item --</option>
                {otherItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title} (by {item.uploader?.name || "Unknown"})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#D94F4F] text-white py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-[#bf3f3f] transition disabled:bg-gray-400"
            >
              {sending ? "Sending..." : "Send swap request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SwapRequests;
