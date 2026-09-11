import Swap from "../models/Swap.js";
import Item from "../models/Item.js";
import sendEmail from "../utils/sendEmail.js";

export const createSwapRequest = async (req, res) => {
  try {
    const { offeredItemId, requestedItemId } = req.body;

    // requester — authenticated user
    const requester = req.user._id;

    // fetch both items
    const offeredItem = await Item.findById(offeredItemId);
    const requestedItem = await Item.findById(requestedItemId);

    if (!offeredItem || !requestedItem) {
      return res.status(404).json({ message: "One or both items not found" });
    }

    // owner = owner of the requested item
    const owner = requestedItem.uploader;

    // create swap request
    const swap = await Swap.create({
      requester,
      owner,
      offeredItem: offeredItemId,
      requestedItem: requestedItemId,
      status: "pending",
    });

    res.status(201).json(swap);
  } catch (error) {
    console.error("❌ Swap Request Error:", error);
    return res.status(500).json({
      message: "Failed to create swap request",
      error: error.message,
    });
  }
};

export const respondToSwap = async (req, res) => {
  try {
    const { swapId, action } = req.body;

    const swap = await Swap.findById(swapId).populate("requester");

    if (!swap) return res.status(404).json({ message: "Swap not found" });

    swap.status = action === "accept" ? "accepted" : "rejected";
    await swap.save();

    res.json({ message: `Swap ${swap.status}` });
  } catch (error) {
    console.error("Swap response error:", error);
    res.status(500).json({ message: "Failed to respond to swap" });
  }
};

export const getAllSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find()
      .populate("offeredItem", "title category images")
      .populate("requestedItem", "title category images")
      .populate("requester", "name email")
      .populate("owner", "name email");

    res.status(200).json(swaps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching swaps", error });
  }
};

