import express from "express";
import { uploadItem, getItems, getMyItems, getCategories, deleteItem } from "../controllers/itemController.js";
import upload from "../utils/multer.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getItems);
router.get("/categories", getCategories);
router.get("/mine", protect, getMyItems);
router.post("/upload", protect, upload.array("images", 5), uploadItem);
router.delete("/:id", protect, deleteItem);

export default router;
