/**
 * Watchlist Model
 * Represents a movie added to a user's watchlist
 * Each user can add a movie to their watchlist only once (enforced by unique index)
 */

import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
    {
        // Reference to the user who added to watchlist
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // TMDB movie ID
        movieId: {
            type: Number,
            required: true,
        },
        // Movie title (stored for convenience)
        title: String,
        // Movie poster path (stored for convenience)
        poster_path: String,
    },
    { timestamps: true }
);

// Prevent duplicates per user
WatchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Watchlist", WatchlistSchema);
