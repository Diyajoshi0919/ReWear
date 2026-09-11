import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';

// 1. Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load Environment Variables (SABSE UPAR)
dotenv.config({ path: path.join(__dirname, "../.env") });
console.log("✅ .env variables loaded");

// 3. Imports
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import clipRoutes from "./routes/clipRoutes.js";
import errorHandler from './middlewares/errorHandler.js';

// 4. App Initialization
const app = express();

// 5. Middleware
app.use(cors({
    origin: ["https://rewear-alpha.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Database Connection (Environment variables load hone ke baad)
connectDB();

// 7. Routes
app.use("/api/clip", clipRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swaps', swapRoutes);

// 8. Error Handler
app.use(errorHandler);

// 9. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));