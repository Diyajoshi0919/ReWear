import express from "express";
import { createSwapRequest, respondToSwap, getAllSwaps } from "../controllers/swapController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/request", protect, createSwapRequest);
router.post("/respond", protect, respondToSwap);
router.get("/", protect, getAllSwaps);

export default router;
