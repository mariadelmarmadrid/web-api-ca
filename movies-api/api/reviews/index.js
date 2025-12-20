import express from "express";
import asyncHandler from "express-async-handler";
import Review from "./reviewModel";
import authenticate from "../../authenticate";

const router = express.Router();

// 🔐 All routes require authentication
router.use(authenticate);

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const reviews = await Review.find({ userId: req.user._id });
        res.status(200).json(reviews);
    })
);

router.post("/", asyncHandler(async (req, res) => {
    try {
        const review = await Review.create({
            userId: req.user._id,
            ...req.body, // movieId, content, rating
        });
        res.status(201).json(review);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this movie",
            });
        }
        throw err;
    }
}));

router.get(
    "/movie/:movieId",
    asyncHandler(async (req, res) => {
        const reviews = await Review.find({
            movieId: req.params.movieId,
        }).populate("userId", "username");

        res.status(200).json(reviews);
    })
);

router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
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