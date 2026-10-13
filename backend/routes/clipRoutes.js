import express from "express";
import axios from "axios";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/clip/suggest  (protected)
// Sends an image URL to the Python CLIP service, which suggests a clothing category.
// The CLIP service runs separately (backend/clip_service). Set CLIP_SERVICE_URL to its
// address; if it isn't set, this route reports the feature as unavailable instead of failing.
router.post("/suggest", protect, async (req, res) => {
  const serviceUrl = process.env.CLIP_SERVICE_URL;
  if (!serviceUrl) {
    return res.status(503).json({ message: "Category suggestion is not available right now" });
  }

  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ message: "imageUrl is required" });
  }

  // Only allow images hosted on our own Cloudinary account
  if (!imageUrl.startsWith(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`)) {
    return res.status(400).json({ message: "Only uploaded ReWear images can be analysed" });
  }

  try {
    const { data } = await axios.post(`${serviceUrl}/suggest`, { imageUrl }, { timeout: 20000 });
    return res.json({ label: data.label, confidence: data.confidence });
  } catch (err) {
    console.error("CLIP suggestion error:", err.message);
    return res.status(502).json({ message: "Failed to get a category suggestion" });
  }
});

export default router;
