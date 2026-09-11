import React, { useState } from "react";
import API from "../api/axios";

const ProductDesign = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    tags: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Handle text input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle image upload
  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please log in first to upload an item.");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);

      const res = await API.post("/items/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Item uploaded successfully!");

      setForm({
        title: "",
        description: "",
        category: "",
        size: "",
        condition: "",
        tags: "",
      });
      setImages([]);
    } catch (err) {
      alert(err.response?.data?.message || "❌ Upload failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF4F2] px-4 sm:px-6 py-6 sm:py-10 flex items-start justify-center">

      <form
        onSubmit={handleSubmit}
        className="
          bg-white w-full max-w-sm sm:max-w-md md:max-w-lg
          p-5 sm:p-7 md:p-8 
          rounded-xl shadow-md 
          space-y-4 sm:space-y-5 mb-6
        "
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#D94F4F] mb-2">
          Upload Item
        </h2>

        <input
          name="title"
          placeholder="Title"
          className="w-full p-3 border rounded text-sm sm:text-base"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-3 border rounded text-sm sm:text-base"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          className="w-full p-3 border rounded text-sm sm:text-base"
          value={form.category}
          onChange={handleChange}
        />

        <input
          name="size"
          placeholder="Size"
          className="w-full p-3 border rounded text-sm sm:text-base"
          value={form.size}
          onChange={handleChange}
        />

        <input
          name="condition"
          placeholder="Condition"
          className="w-full p-3 border rounded text-sm sm:text-base"
          value={form.condition}
          onChange={handleChange}
        />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="w-full p-3 border rounded text-sm sm:text-base"
          value={form.tags}
          onChange={handleChange}
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm"
          accept="image/*"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-3 rounded-md text-sm sm:text-base transition 
            ${loading ? "bg-gray-400" : "bg-[#D94F4F] hover:bg-[#bf3f3f]"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default ProductDesign;
