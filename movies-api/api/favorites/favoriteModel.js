/**
 * Favorite Model
 * Represents a movie marked as favorite by a user
 * Each user can favorite a movie only once (enforced by unique index)
 */

import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
    {
        // Reference to the user who favorited the movie
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

// Ensure each user can only favorite a movie once
FavoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Favorite", FavoriteSchema);