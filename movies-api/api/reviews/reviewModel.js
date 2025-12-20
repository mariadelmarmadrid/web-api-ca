import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
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
        content: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// One review per user per movie (same idea as favorites)
ReviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
