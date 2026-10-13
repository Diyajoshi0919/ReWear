import Swap from "../models/Swap.js";
import Item from "../models/Item.js";
import sendEmail from "../utils/sendEmail.js";

// POST /api/swaps/request  (protected)
export const createSwapRequest = async (req, res) => {
  const { offeredItemId, requestedItemId } = req.body;
  const requester = req.user._id;

  if (!offeredItemId || !requestedItemId) {
    return res.status(400).json({ message: "Both offeredItemId and requestedItemId are required" });
  }

  const [offeredItem, requestedItem] = await Promise.all([
    Item.findById(offeredItemId),
    Item.findById(requestedItemId).populate("uploader", "name email"),
  ]);

  if (!offeredItem || !requestedItem) {
    return res.status(404).json({ message: "One or both items not found" });
  }

  // You can only offer an item you own
  if (String(offeredItem.uploader) !== String(requester)) {
    return res.status(403).json({ message: "You can only offer your own items" });
  }

  // You can't request your own item
  if (String(requestedItem.uploader._id) === String(requester)) {
    return res.status(400).json({ message: "You can't request your own item" });
  }

  if (offeredItem.status !== "available" || requestedItem.status !== "available") {
    return res.status(400).json({ message: "One of these items has already been swapped" });
  }

  // Prevent sending the same request twice
  const duplicate = await Swap.findOne({
    requester,
    offeredItem: offeredItemId,
    requestedItem: requestedItemId,
    status: "pending",
  });
  if (duplicate) {
    return res.status(400).json({ message: "You already have a pending request for this swap" });
  }

  const swap = await Swap.create({
    requester,
    owner: requestedItem.uploader._id,
    offeredItem: offeredItemId,
    requestedItem: requestedItemId,
  });

  // Notify the owner (skipped automatically if email isn't configured)
  sendEmail(
    requestedItem.uploader.email,
    "New swap request on ReWear",
    `${req.user.name} wants to swap their "${offeredItem.title}" for your "${requestedItem.title}". Log in to ReWear to accept or reject it.`
  );

  res.status(201).json(swap);
};

// POST /api/swaps/respond  (protected) - only the owner can accept/reject
export const respondToSwap = async (req, res) => {
  const { swapId, action } = req.body;

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Action must be 'accept' or 'reject'" });
  }

  const swap = await Swap.findById(swapId).populate("requester", "name email");
  if (!swap) return res.status(404).json({ message: "Swap not found" });

  if (String(swap.owner) !== String(req.user._id)) {
    return res.status(403).json({ message: "Only the owner of the requested item can respond" });
  }

  if (swap.status !== "pending") {
    return res.status(400).json({ message: `This swap was already ${swap.status}` });
  }

  if (action === "reject") {
    swap.status = "rejected";
    await swap.save();
    return res.json({ message: "Swap rejected", swap });
  }

  // Accept: claim both items atomically. updateMany with status:"available"
  // ensures neither item was swapped by another request in the meantime.
  const itemIds = [swap.offeredItem, swap.requestedItem];
  const result = await Item.updateMany(
    { _id: { $in: itemIds }, status: "available" },
    { status: "swapped" }
  );

  if (result.modifiedCount !== 2) {
    // Roll back if only one item was updated
    if (result.modifiedCount === 1) {
      await Item.updateMany({ _id: { $in: itemIds } }, { status: "available" });
    }
    return res.status(400).json({ message: "One of these items is no longer available" });
  }

  swap.status = "accepted";
  await swap.save();

  // Any other pending requests involving these items can no longer happen
  await Swap.updateMany(
    {
      _id: { $ne: swap._id },
      status: "pending",
      $or: [{ offeredItem: { $in: itemIds } }, { requestedItem: { $in: itemIds } }],
    },
    { status: "rejected" }
  );

  sendEmail(
    swap.requester.email,
    "Your ReWear swap was accepted",
    `${req.user.name} accepted your swap request. You can reach them at ${req.user.email} to arrange the exchange.`
  );

  res.json({ message: "Swap accepted", swap });
};

// GET /api/swaps  (protected) - only swaps the logged-in user is part of
export const getMySwaps = async (req, res) => {
  const swaps = await Swap.find({
    $or: [{ requester: req.user._id }, { owner: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .populate("offeredItem", "title category images status")
    .populate("requestedItem", "title category images status")
    // Emails are shown only to the two people in the swap, so they can contact each other
    .populate("requester", "name email")
    .populate("owner", "name email");

  res.status(200).json(swaps);
};
