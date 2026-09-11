import mongoose from "mongoose";

const swapSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Swap || mongoose.model("Swap", swapSchema);
