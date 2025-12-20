import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import moviesRouter from './api/movies';
import usersRouter from './api/users';
import watchlistRouter from "./api/watchlist";
import reviewsRouter from "./api/reviews";
import './db';
import authenticate from './authenticate';
import favoritesRouter from "./api/favorites";

dotenv.config();

const errHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }

  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
};

const app = express();

const port = process.env.PORT;

// Enable CORS for all requests
app.use(cors());

app.use(express.json());

app.use('/api/movies', moviesRouter);

app.use('/api/users', usersRouter);

app.use("/api/favorites", favoritesRouter);

app.use("/api/watchlist", watchlistRouter);

app.use("/api/reviews", reviewsRouter);

app.use(errHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
