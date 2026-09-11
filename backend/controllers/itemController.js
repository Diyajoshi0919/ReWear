import Item from "../models/Item.js";

export const uploadItem = async (req, res) => {
  try {
    const { title, description, category, size, condition, tags } = req.body;
    const uploader = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Cloudinary URLs come as file.path from multer-storage-cloudinary
    const imageUrls = req.files.map((file) => file.path);

    const item = await Item.create({
      title,
      description,
      category,
      size,
      condition,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      images: imageUrls,
      uploader,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("uploader", "name email");
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};
