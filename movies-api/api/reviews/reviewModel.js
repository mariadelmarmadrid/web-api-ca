/**
 * Review Model
 * Represents a user's review of a movie
 * Each user can review a movie only once (enforced by unique index)
 */

import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        // Reference to the user who wrote the review
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // TMDB movie ID being reviewed
        movieId: {
            type: Number,
            required: true,
        },
        // Review text content
        content: {
            type: String,
            required: true,
        },
        // Numeric rating (e.g., 1-10 or 1-5)
        rating: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Ensure each user can only review a movie once
ReviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
