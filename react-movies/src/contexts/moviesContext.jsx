import React, { useState, useEffect, useMemo, useContext } from "react";
import { MoviesContext } from "./moviesContextValue";
import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from "../api/favorites-api";
import {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
} from "../api/watchlist-api";
import {
    getUserReviews,
    addReview as apiAddReview,
    deleteReview,
} from "../api/reviews-api";
import { AuthContext } from "./authContext";

/**
 * MoviesContextProvider
 * Provides movie-related user data and actions to the app:
 * - favorites
 * - watchlist
 * - user reviews
 *
 * The provider loads user-specific data when authentication changes
 * and exposes helper actions to mutate that data (these call the
 * backend APIs and update local state accordingly).
 */
const MoviesContextProvider = ({ children }) => {
    // auth state from AuthContext
    const { isAuthenticated } = useContext(AuthContext);

    // ---------------- State ----------------
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    // Store reviews in an object keyed by TMDB movieId for O(1) lookup
    const [myReviews, setMyReviews] = useState({});

    // ---------------- Load user data on auth changes ----------------
    useEffect(() => {
        // Defining an async loader inside the effect
        const loadUserData = async () => {
            try {
                const [favList, watchList, reviews] = await Promise.all([
                    getFavorites().catch(() => []),
                    getWatchlist().catch(() => []),
                    getUserReviews().catch(() => []),
                ]);

                setFavorites(favList || []);
                setWatchlist(watchList || []);

                // Convert reviews array into a map keyed by movieId
                const reviewsByMovie = {};
                (reviews || []).forEach((r) => {
                    reviewsByMovie[r.movieId] = r;
                });
                setMyReviews(reviewsByMovie);
            } catch (err) {
                // Keep UI resilient: log and reset to safe defaults
                // (network errors or backend errors shouldn't crash the app)
                // eslint-disable-next-line no-console
                console.error("Failed to load user data:", err);
                setFavorites([]);
                setWatchlist([]);
                setMyReviews({});
            }
        };

        if (isAuthenticated) {
            loadUserData();
        } else {
            // Clear any user-specific data when logged out
            setFavorites([]);
            setWatchlist([]);
            setMyReviews({});
        }
    }, [isAuthenticated]);

    // ---------------- Favorites ----------------
    /**
     * Add a movie to favorites (backend + local state)
     * No-op if already present.
     */
    const addToFavorites = async (movie) => {
        try {
            const exists = favorites.some((f) => f.movieId === movie.id);
            if (exists) return;

            const newFavorite = await addFavorite(movie);
            setFavorites((prev) => [...prev, newFavorite]);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to add favorite:", err);
            throw err;
        }
    };

    /**
     * Remove a movie from favorites (backend + local state)
     */
    const removeFromFavorites = async (movie) => {
        try {
            const fav = favorites.find((f) => f.movieId === movie.id);
            if (!fav) return;

            await removeFavorite(fav._id);
            setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to remove favorite:", err);
            throw err;
        }
    };

    // ---------------- Watchlist (TOGGLE) ----------------
    /**
     * Toggle movie in user's watchlist. If present remove it,
     * otherwise add it.
     */
    const toggleWatchlist = async (movie) => {
        try {
            const existing = watchlist.find((w) => w.movieId === movie.id);

            if (existing) {
                // Remove
                await removeFromWatchlist(existing._id);
                setWatchlist((prev) => prev.filter((w) => w._id !== existing._id));
            } else {
                // Add
                const newItem = await addToWatchlist(movie);
                setWatchlist((prev) => [...prev, newItem]);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to toggle watchlist item:", err);
            throw err;
        }
    };

    const isInWatchlist = (movieId) => watchlist.some((w) => w.movieId === movieId);

    // ---------------- Reviews ----------------
    /**
     * Add a review for a movie. Persists to backend and stores
     * the returned review object keyed by `movie.id` for quick lookup.
     * `review` should contain `{ content, rating }`.
     */
    const addReview = async (movie, review) => {
        try {
            const created = await apiAddReview({ movieId: movie.id, ...review });
            setMyReviews((prev) => ({ ...prev, [movie.id]: created }));
            return created;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to add review:", err);
            throw err;
        }
    };

    // ---------------- Region & Language ----------------
    // Persist UI region & language preferences to localStorage
    const [region, setRegion] = useState(
        localStorage.getItem("tmdb_region") || import.meta.env.VITE_TMDB_REGION || "IE"
    );

    const [language, setLanguage] = useState(
        localStorage.getItem("tmdb_language") || import.meta.env.VITE_TMDB_LANGUAGE || "en-US"
    );

    useEffect(() => {
        localStorage.setItem("tmdb_region", region);
    }, [region]);

    useEffect(() => {
        localStorage.setItem("tmdb_language", language);
    }, [language]);

    // ---------------- Context Value ----------------
    const value = useMemo(
        () => ({
            // Favorites
            favorites,
            addToFavorites,
            removeFromFavorites,

            // Watchlist
            watchlist,
            toggleWatchlist,
            isInWatchlist,

            // Reviews
            myReviews,
            addReview,

            // UI prefs
            region,
            setRegion,
            language,
            setLanguage,
        }),
        [favorites, watchlist, myReviews, region, language, isAuthenticated]
    );

    return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export default MoviesContextProvider;
