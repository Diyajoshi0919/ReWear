// Loads environment variables BEFORE any other module reads them.
// In ES modules all imports run before the importing file's body, so calling
// dotenv.config() inside server.js was too late for files like cloudinaryConfig.js.
// server.js imports this file first to fix that.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Look for backend/.env first, then the repo-root .env (the old location).
dotenv.config({ path: path.join(__dirname, "../.env"), quiet: true });
dotenv.config({ path: path.join(__dirname, "../../.env"), quiet: true });

const required = ["MONGODB_URI", "JWT_SECRET", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`❌ Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}
