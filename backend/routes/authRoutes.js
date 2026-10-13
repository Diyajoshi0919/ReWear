import express from "express";
import { login, register, getMe } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", register);
authRoutes.post("/login", login);
authRoutes.get("/me", protect, getMe);

export default authRoutes;
