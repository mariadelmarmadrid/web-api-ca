import express from "express";
import asyncHandler from "express-async-handler";
import Watchlist from "./watchlistModel";
import authenticate from "../../authenticate";

const router = express.Router();

// Get user's watchlist
router.get(
    "/",
    authenticate,
    asyncHandler(async (req, res) => {
        const items = await Watchlist.find({ userId: req.user._id });
        res.status(200).json(items);
    })
);

// Add to watchlist
router.post(
    "/",
    authenticate,
    asyncHandler(async (req, res) => {
        const item = await Watchlist.create({
            userId: req.user._id,
            ...req.body,
        });
        res.status(201).json(item);
    })
);

// Remove from watchlist
router.delete(
    "/:id",
    authenticate,
    asyncHandler(async (req, res) => {
        await Watchlist.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        res.status(204).end();
    })
);

export default router;
