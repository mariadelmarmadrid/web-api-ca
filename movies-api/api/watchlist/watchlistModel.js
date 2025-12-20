import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movieId: {
            type: Number,
            required: true,
        },
        title: String,
        poster_path: String,
    },
    { timestamps: true }
);

// Prevent duplicates per user
WatchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Watchlist", WatchlistSchema);
