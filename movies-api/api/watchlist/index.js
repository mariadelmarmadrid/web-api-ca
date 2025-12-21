/**
 * Watchlist API Router
 * Handles all endpoints related to user watchlist
 * All routes require authentication
 */

import express from "express";
import asyncHandler from "express-async-handler";
import Watchlist from "./watchlistModel";
import authenticate from "../../authenticate";

const router = express.Router();

/**
 * GET /api/watchlist
 * Retrieves all movies in the logged-in user's watchlist
 * Returns: Array of watchlist item objects
 */
router.get(
    "/",
    authenticate,
    asyncHandler(async (req, res) => {
        const items = await Watchlist.find({ userId: req.user._id });
        res.status(200).json(items);
    })
);

/**
 * POST /api/watchlist
 * Adds a movie to the logged-in user's watchlist
 * Body: { movieId, title, poster_path }
 * Returns: Created watchlist item object
 */
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

/**
 * DELETE /api/watchlist/:id
 * Removes a movie from the logged-in user's watchlist
 * Ensures user can only delete their own watchlist items
 * Returns: 204 No Content on success
 */
router.delete(
    "/:id",
    authenticate,
    asyncHandler(async (req, res) => {
        // Delete only if it belongs to the authenticated user
        await Watchlist.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        res.status(204).end();
    })
);

export default router;
