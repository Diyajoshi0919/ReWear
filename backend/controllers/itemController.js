import Item from "../models/Item.js";
import Swap from "../models/Swap.js";

// Escape special characters so user input is treated as plain text in a regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/items/upload  (protected)
export const uploadItem = async (req, res) => {
  const { title, description, category, size, condition, tags } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Please upload at least one image" });
  }
  if (!title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  // multer-storage-cloudinary puts the Cloudinary URL in file.path
  const imageUrls = req.files.map((file) => file.path);

  const item = await Item.create({
    title,
    description,
    category,
    size,
    condition,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
    images: imageUrls,
    uploader: req.user._id,
  });

  res.status(201).json(item);
};

// GET /api/items?search=jacket&category=Shirts&status=available
// Public. Never exposes uploader emails.
export const getItems = async (req, res) => {
  const { search, category, status = "available" } = req.query;
  const filter = {};

  if (status !== "all") filter.status = status;
  if (category && category !== "All") filter.category = category;

  if (search?.trim()) {
    // Case-insensitive partial match, so "jack" finds "Denim Jacket"
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ title: regex }, { description: regex }, { tags: regex }, { category: regex }];
  }

  const items = await Item.find(filter).sort({ createdAt: -1 }).populate("uploader", "name");
  res.status(200).json(items);
};

// GET /api/items/categories  - distinct categories for the filter dropdown
export const getCategories = async (req, res) => {
  const categories = await Item.distinct("category", { category: { $nin: [null, ""] } });
  res.json(categories.sort());
};

// GET /api/items/mine  (protected) - the logged-in user's own listings
export const getMyItems = async (req, res) => {
  const items = await Item.find({ uploader: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
};

// DELETE /api/items/:id  (protected) - only the owner can delete
export const deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (String(item.uploader) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can only delete your own items" });
  }

  await item.deleteOne();

  // Pending swaps involving this item can't happen anymore
  await Swap.updateMany(
    { status: "pending", $or: [{ offeredItem: item._id }, { requestedItem: item._id }] },
    { status: "rejected" }
  );

  res.json({ message: "Item deleted" });
};
