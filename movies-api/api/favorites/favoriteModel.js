import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Favorite", FavoriteSchema);
