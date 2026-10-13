import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import API, { errorMessage } from "../api/axios";

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the category list once
  useEffect(() => {
    API.get("/items/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Debounce: wait 400ms after the user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch items from the server whenever the search or category changes
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/items", {
          params: { search: search || undefined, category: selectedCategory },
        });
        setItems(res.data);
      } catch (err) {
        setError(errorMessage(err, "Couldn't load items"));
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FDF4F2] px-4 sm:px-6 md:px-10 py-6 sm:py-10 text-[#2E2E2E]">

      <h1 className="text-2xl sm:text-3xl font-bold text-[#D94F4F] mb-6 sm:mb-8 text-center">
        Browse Items
      </h1>

      {/* Search + Filter */}
      <div className="max-w-2xl mx-auto mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <span className="sr-only">Search items</span>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, description or tag"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#D94F4F] text-sm sm:text-base"
          />
        </label>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          className="sm:w-48 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#D94F4F] text-sm sm:text-base"
        >
          <option value="All">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading items...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">
          {search || selectedCategory !== "All" ? "No items match your search." : "No items listed yet."}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-3 sm:p-4 flex flex-col"
            >
              <img
                src={item.images?.[0] || "/placeholder.svg"}
                alt={item.title}
                loading="lazy"
                className="w-full h-36 sm:h-44 md:h-48 object-cover rounded-xl mb-3 sm:mb-4"
              />

              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold mb-1">{item.title}</h2>

                {item.category && (
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    {item.category}{item.size ? `, size ${item.size}` : ""}
                  </p>
                )}

                {item.description && (
                  <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">{item.description}</p>
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
