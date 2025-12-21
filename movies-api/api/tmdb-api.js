import fetch from "node-fetch";

/**
 * Server-side TMDB helper
 * This module proxies requests from the web API to The Movie Database (TMDB).
 * All requests are signed using the server-side `TMDB_KEY` environment variable
 * and returned to the web API caller. Keeping the TMDB key on the server
 * prevents exposing it to the browser.
 */

const TMDB = "https://api.themoviedb.org/3";

/**
 * tmdbFetch
 * Helper to call TMDB endpoints and handle errors consistently.
 * @param {string} path - TMDB path (e.g. 'movie/123')
 * @param {object} params - query parameters to include (language, region, page, etc.)
 * @returns {Promise<object>} - parsed JSON response from TMDB
 * @throws {Error} - when TMDB responds with a non-OK status
 */
async function tmdbFetch(path, params = {}) {
    const url = new URL(`${TMDB}/${path}`);
    // Always include API key from server env
    url.searchParams.set("api_key", process.env.TMDB_KEY);

    // Add any provided params (language, region, page, etc.)
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value);
        }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        // Try to parse TMDB error payload; fall back to generic message
        const error = await response.json().catch(() => null);
        throw new Error(error?.status_message || "TMDB request failed");
    }

    return response.json();
}

// -------------------- Exported helpers (used by the web API) --------------------

/**
 * Discover movies (used on Home/Discover)
 * Accepts language, region and page and excludes adult/video results.
 */
export const getMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("discover/movie", {
        language,
        region,
        page,
        include_adult: false,
        include_video: false,
        sort_by: "popularity.desc",
    });

/**
 * Get popular movies (paginated)
 */
export const getPopularMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/popular", { language, region, page });

/**
 * Get movies that are now playing (paginated)
 */
export const getNowPlayingMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/now_playing", { language, region, page });

/**
 * Get upcoming movies (paginated)
 */
export const getUpcomingMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/upcoming", { language, region, page });

/**
 * Get top rated movies (paginated)
 */
export const getTopRatedMovies = ({ language, region, page = 1 }) =>
    tmdbFetch("movie/top_rated", { language, region, page });

/**
 * Single movie details
 * @param {{id: number, language?: string}}
 */
export const getMovie = ({ id, language }) => tmdbFetch(`movie/${id}`, { language });

/**
 * Movie images (posters/backdrops)
 */
export const getMovieImages = ({ id, language }) =>
    tmdbFetch(`movie/${id}/images`, { language });

/**
 * Movie reviews (from TMDB)
 */
export const getMovieReviews = ({ id, language }) =>
    tmdbFetch(`movie/${id}/reviews`, { language });

/**
 * Movie recommendations (supports pagination)
 */
export const getMovieRecommendations = ({ id, language, page = 1 }) =>
    tmdbFetch(`movie/${id}/recommendations`, { language, page });

/**
 * Movie credits (cast & crew)
 */
export const getMovieCredits = ({ id, language }) =>
    tmdbFetch(`movie/${id}/credits`, { language });

/**
 * List of genres
 */
export const getGenres = ({ language }) => tmdbFetch("genre/movie/list", { language });

/**
 * Person (actor/crew) details
 */
export const getPerson = ({ id, language }) => tmdbFetch(`person/${id}`, { language });

/**
 * Person movie credits
 */
export const getPersonMovieCredits = ({ id, language }) =>
    tmdbFetch(`person/${id}/movie_credits`, { language });