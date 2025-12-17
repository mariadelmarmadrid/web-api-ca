import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  getMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getMovie,
  getMovieReviews,
  getMovieRecommendations,
  getMovieCredits,
  getGenres,
} from "../tmdb-api.js";

const router = express.Router();

// movie routes to be added
router.get('/discover', asyncHandler(async (req, res) => {
    const discoverMovies = await getMovies();
    res.status(200).json(discoverMovies);
}));

router.get("/popular", asyncHandler(async (req, res) => {
  res.json(await getPopularMovies(req.query));
}));

router.get("/now-playing", asyncHandler(async (req, res) => {
  res.json(await getNowPlayingMovies(req.query));
}));

router.get("/upcoming", asyncHandler(async (req, res) => {
  res.json(await getUpcomingMovies(req.query));
}));

router.get("/top-rated", asyncHandler(async (req, res) => {
  res.json(await getTopRatedMovies(req.query));
}));

router.get("/genres", asyncHandler(async (req, res) => {
  res.json(await getGenres(req.query));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  res.json(await getMovie(req.params.id, req.query.language));
}));

router.get("/:id/reviews", asyncHandler(async (req, res) => {
  res.json(await getMovieReviews(req.params.id, req.query));
}));

router.get("/:id/recommendations", asyncHandler(async (req, res) => {
  res.json(await getMovieRecommendations(req.params.id, req.query));
}));

router.get("/:id/credits", asyncHandler(async (req, res) => {
  res.json(await getMovieCredits(req.params.id, req.query.language));
}));

export default router;
