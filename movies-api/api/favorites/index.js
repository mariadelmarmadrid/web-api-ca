/**
 * Favorites API Router
 * Handles all endpoints related to user favorites
 * All routes require authentication
 */

import express from "express";
import asyncHandler from "express-async-handler";
import Favorite from "./favoriteModel";
import authenticate from "../../authenticate";

const router = express.Router();

// 🔐 All routes require authentication
router.use(authenticate);

/**
 * GET /api/favorites
 * Retrieves all favorite movies for the logged-in user
 * Returns: Array of favorite movie objects
 */
router.get("/", asyncHandler(async (req, res) => {
    const favorites = await Favorite.find({ userId: req.user._id });
    res.status(200).json(favorites);
}));

/**
 * POST /api/favorites
 * Adds a movie to the logged-in user's favorites
 * Prevents duplicate favorites using MongoDB unique index
 * Body: { movieId, title, poster_path }
 * Returns: Created favorite object or error if already favorited
 */
router.post("/", authenticate, async (req, res) => {
    try {
        const favorite = await Favorite.create({
            userId: req.user._id,
            ...req.body,
        });
        res.status(201).json(favorite);
    } catch (err) {
        // Handle duplicate key error (movie already in favorites)
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Movie already in favorites",
            });
        }
        throw err;
    }
});

/**
 * DELETE /api/favorites/:id
 * Removes a movie from the logged-in user's favorites
 * Ensures user can only delete their own favorites
 * Returns: 204 No Content on success, 404 if not found
 */
router.delete("/:id", authenticate, async (req, res) => {
    const result = await Favorite.deleteOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    // Verify the favorite belongs to the user and was actually deleted
    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(204).end();
});


export default router;
