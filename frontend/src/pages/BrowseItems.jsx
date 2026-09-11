import React, { useEffect, useState } from "react";
import axios from "axios";

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://rewearserverlatest.onrender.com/api";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/items`);
        const data = Array.isArray(res.data) ? res.data : res.data.items;

        setItems(data);
        setFilteredItems(data);

        const cats = Array.from(new Set(data.map((i) => i.category))).filter(
          (c) => c
        );
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);

    if (cat === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((i) => i.category === cat));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF4F2] px-4 sm:px-6 md:px-10 py-6 sm:py-10 text-[#2E2E2E]">

      <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] mb-6 sm:mb-8 text-center">
        Browse Items
      </h1>

      {/* Filter Dropdown */}
      <div className="max-w-xs sm:max-w-sm mx-auto mb-6 sm:mb-8">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white 
                     focus:outline-none focus:ring-2 focus:ring-[#D94F4F] text-sm sm:text-base"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading items...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5
            gap-4 sm:gap-6 md:gap-8
          "
        >
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-3 sm:p-4 flex flex-col"
            >
              <img
                src={
                  item.images?.[0] ||
                  "https://via.placeholder.com/200x250?text=No+Image"
                }
                alt={item.title}
                className="w-full h-36 sm:h-44 md:h-48 object-cover rounded-xl mb-3 sm:mb-4"
              />

              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold mb-1">
                  {item.title}
                </h2>

                {item.category && (
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    {item.category}
                  </p>
                )}

                {item.description && (
                  <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-3 sm:mt-4">
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Uploaded by: {item.uploader?.name || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default BrowseItems;
