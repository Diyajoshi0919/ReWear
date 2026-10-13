import React, { useState } from "react";
import API, { errorMessage } from "../api/axios";

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
  const [fileInputKey, setFileInputKey] = useState(0); // changing this clears the file input

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

    if (images.length === 0) {
      alert("Please choose at least one image.");
      return;
    }
    if (images.length > 5) {
      alert("You can upload up to 5 images.");
      return;
    }
    if (images.some((img) => img.size > 5 * 1024 * 1024)) {
      alert("Each image must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);

      // axios sets the multipart Content-Type (with boundary) and the token automatically
      await API.post("/items/upload", formData);

      alert("✅ Item uploaded!");

      setForm({
        title: "",
        description: "",
        category: "",
        size: "",
        condition: "",
        tags: "",
      });
      setImages([]);
      setFileInputKey((k) => k + 1);
    } catch (err) {
      alert(errorMessage(err, "Upload failed. Please try again."));
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
          key={fileInputKey}
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm"
          accept="image/jpeg,image/png"
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
