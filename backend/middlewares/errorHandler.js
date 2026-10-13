import multer from "multer";

export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Express 5 forwards errors from async handlers here automatically.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Invalid MongoDB ObjectId, e.g. /api/items/abc
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }
  // Mongoose schema validation failed
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  // Duplicate unique field (email)
  if (err.code === 11000) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }
  // File too large, too many files, etc.
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  // Cloudinary rejects a file type it isn't allowed to accept
  if (err.message && err.message.includes("file format")) {
    return res.status(400).json({ message: "Only JPG and PNG images are allowed" });
  }

  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    // Don't leak internal error details to users in production
    message: process.env.NODE_ENV === "production" && status === 500 ? "Something went wrong" : err.message,
  });
};
