import express from "express";
import asyncHandler from "express-async-handler";
import Favorite from "./favoriteModel";
import authenticate from "../../authenticate";

const router = express.Router();

// 🔐 All routes require authentication
router.use(authenticate);

// GET logged-in user's favorites
router.get("/", asyncHandler(async (req, res) => {
    const favorites = await Favorite.find({ userId: req.user._id });
    res.status(200).json(favorites);
}));

// POST add a favorite
router.post("/", authenticate, async (req, res) => {
    try {
        const favorite = await Favorite.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json(favorite);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Already in favorites" });
        }
        throw err;
    }
});


// DELETE /api/favorites/:id
router.delete("/:id", authenticate, async (req, res) => {
    const result = await Favorite.deleteOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(204).end();
});


export default router;
