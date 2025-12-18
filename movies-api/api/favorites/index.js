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
router.post("/", asyncHandler(async (req, res) => {
    const favorite = await Favorite.create({
        userId: req.user._id,
        movieId: req.body.movieId,
        title: req.body.title,
        poster_path: req.body.poster_path,
    });

    res.status(201).json(favorite);
}));

// DELETE a favorite
router.delete("/:movieId", asyncHandler(async (req, res) => {
    await Favorite.deleteOne({
        userId: req.user._id,
        movieId: req.params.movieId,
    });

    res.status(204).end();
}));

export default router;
