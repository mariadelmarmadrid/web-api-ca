import express from "express";
import asyncHandler from "express-async-handler";
import {
  getMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getMovie,
  getMovieImages,
  getMovieReviews,
  getMovieRecommendations,
  getMovieCredits,
  getGenres,
  getPerson,             
  getPersonMovieCredits, 
} from "../tmdb-api.js";

const router = express.Router();

// Discover (home)
router.get("/discover", asyncHandler(async (req, res) => {
  res.json(await getMovies(req.query));
}));

// Lists
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

// Single movie
router.get("/:id", asyncHandler(async (req, res) => {
  res.json(await getMovie({ id: req.params.id, ...req.query }));
}));

router.get("/:id/images", asyncHandler(async (req, res) => {
  res.json(await getMovieImages({ id: req.params.id, ...req.query }));
}));

router.get("/:id/reviews", asyncHandler(async (req, res) => {
  res.json(await getMovieReviews({ id: req.params.id, ...req.query }));
}));

router.get("/:id/recommendations", asyncHandler(async (req, res) => {
  res.json(await getMovieRecommendations({ id: req.params.id, ...req.query }));
}));

router.get("/:id/credits", asyncHandler(async (req, res) => {
  res.json(await getMovieCredits({ id: req.params.id, ...req.query }));
}));

// ---------- Person ----------

// Person details
router.get("/person/:id", asyncHandler(async (req, res) => {
  res.json(await getPerson({ id: req.params.id, ...req.query }));
}));

// Person movie credits (filmography)
router.get("/person/:id/movie_credits", asyncHandler(async (req, res) => {
  res.json(await getPersonMovieCredits({ id: req.params.id, ...req.query }));
}));


export default router;
