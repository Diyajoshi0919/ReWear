import express from "express";
import { uploadItem, getItems } from "../controllers/itemController.js";
import upload from "../utils/multer.js";
import  protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.array("images", 5), uploadItem);
router.get("/", getItems);

export default router;
