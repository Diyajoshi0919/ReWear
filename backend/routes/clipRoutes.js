import express from "express";
import axios from "axios";

const router = express.Router();

// POST /api/clip/suggest
router.post("/suggest", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    // Send image URL to Flask CLIP API
    const flaskResponse = await axios.post("http://127.0.0.1:5001/suggest", {
      imageUrl,
    });

    // Return the prediction to frontend
    return res.json({
      label: flaskResponse.data.label,
      confidence: flaskResponse.data.confidence,
    });
  } catch (err) {
    console.error("Error fetching CLIP suggestion:", err.message);
    return res.status(500).json({ error: "Failed to get suggestion" });
  }
});

export default router;
