import fetch from "node-fetch";

const TMDB = "https://api.themoviedb.org/3";

async function tmdbFetch(path, params = {}) {
    const url = new URL(`${TMDB}/${path}`);
    url.searchParams.set("api_key", process.env.TMDB_KEY);

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.status_message || "TMDB request failed");
    }

    return response.json();
}


export const getMovies = ({ language, region, page = 1 }) =>
  tmdbFetch("discover/movie", {
    language,
    region,
    page,
    include_adult: false,
    include_video: false,
    sort_by: "popularity.desc",
  });


export const getPopularMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/popular", { language, region, page });

export const getNowPlayingMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/now_playing", { language, region, page });

export const getUpcomingMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/upcoming", { language, region, page });

export const getTopRatedMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/top_rated", { language, region, page });

export const getMovie = (id, language) =>
    tmdbFetch(`movie/${id}`, { language });

export const getMovieImages = (id, language) =>
    tmdbFetch(`movie/${id}/images`, { language });

export const getMovieReviews = (id, language) =>
    tmdbFetch(`movie/${id}/reviews`, { language });

export const getMovieRecommendations = (id, language) =>
    tmdbFetch(`movie/${id}/recommendations`, { language });

export const getMovieCredits = (id, language) =>
    tmdbFetch(`movie/${id}/credits`, { language });

export const getGenres = ({ language }) =>
    tmdbFetch("genre/movie/list", { language });

export const getPerson = (id, language) =>
    tmdbFetch(`person/${id}`, { language });

export const getPersonMovieCredits = (id, language) =>
    tmdbFetch(`person/${id}/movie_credits`, { language });