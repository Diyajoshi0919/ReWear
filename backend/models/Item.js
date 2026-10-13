import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 1000 },
    category: { type: String, trim: true, maxlength: 50 },
    size: { type: String, trim: true, maxlength: 20 },
    condition: { type: String, trim: true, maxlength: 50 },
    tags: [{ type: String, trim: true }],
    images: {
      type: [String],
      validate: [(arr) => arr.length > 0, "At least one image is required"],
    },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["available", "swapped"], default: "available" },
  },
  { timestamps: true }
);

// Text index powers keyword search across title, description and tags
itemSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
