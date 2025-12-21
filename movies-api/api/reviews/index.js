/**
 * Reviews API Router
 * Handles all endpoints related to movie reviews
 * All routes require authentication
 */

import express from "express";
import asyncHandler from "express-async-handler";
import Review from "./reviewModel";
import authenticate from "../../authenticate";

const router = express.Router();

// 🔐 All routes require authentication
router.use(authenticate);

/**
 * GET /api/reviews
 * Retrieves all reviews written by the logged-in user
 * Returns: Array of review objects
 */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const reviews = await Review.find({ userId: req.user._id });
        res.status(200).json(reviews);
    })
);

/**
 * POST /api/reviews
 * Creates a new review for a movie
 * Prevents duplicate reviews (one per user per movie)
 * Body: { movieId, content, rating }
 * Returns: Created review object or error if already reviewed
 */
router.post("/", asyncHandler(async (req, res) => {
    try {
        const review = await Review.create({
            userId: req.user._id,
            movieId: req.body.movieId,
            content: req.body.content,
            rating: req.body.rating,
        });

        return res.status(201).json(review);
    } catch (err) {
        // Handle duplicate key error (user already reviewed this movie)
        if (err.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this movie",
            });
        }

        // Return validation errors
        return res.status(400).json({
            message: err.message,
        });
    }
}));


/**
 * GET /api/reviews/movie/:movieId
 * Retrieves all reviews for a specific movie
 * Includes username info for each reviewer
 * Returns: Array of review objects with reviewer info
 */
router.get(
    "/movie/:movieId",
    asyncHandler(async (req, res) => {
        const reviews = await Review.find({
            movieId: req.params.movieId,
        }).populate("userId", "username"); // Include reviewer's username

        res.status(200).json(reviews);
    })
);

/**
 * DELETE /api/reviews/:id
 * Deletes a review written by the logged-in user
 * Ensures user can only delete their own reviews
 * Returns: 204 No Content on success, 404 if not found
 */
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        // Delete only if review belongs to the authenticated user
        const result = await Review.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ message: "Review not found" });
        }

        res.status(204).end();
    })
);


export default router;