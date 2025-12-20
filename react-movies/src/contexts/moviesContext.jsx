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
import { AuthContext } from "./authContext";

const MoviesContextProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    // ---------------- State ----------------
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [myReviews, setMyReviews] = useState({});

    // ---------------- Load data on auth change ----------------
    useEffect(() => {
        if (isAuthenticated) {
            getFavorites().then(setFavorites);
            getWatchlist().then(setWatchlist);
        } else {
            setFavorites([]);
            setWatchlist([]);
        }
    }, [isAuthenticated]);

    // ---------------- Favorites ----------------
    const addToFavorites = async (movie) => {
        const exists = favorites.some((f) => f.movieId === movie.id);
        if (exists) return;

        const newFavorite = await addFavorite(movie);
        setFavorites((prev) => [...prev, newFavorite]);
    };

    const removeFromFavorites = async (movie) => {
        const fav = favorites.find((f) => f.movieId === movie.id);
        if (!fav) return;

        await removeFavorite(fav._id);
        setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
    };

    // ---------------- Watchlist (TOGGLE) ----------------
    const toggleWatchlist = async (movie) => {
        const existing = watchlist.find((w) => w.movieId === movie.id);

        if (existing) {
            // REMOVE
            await removeFromWatchlist(existing._id);
            setWatchlist((prev) => prev.filter((w) => w._id !== existing._id));
        } else {
            // ADD
            const newItem = await addToWatchlist(movie);
            setWatchlist((prev) => [...prev, newItem]);
        }
    };


    const isInWatchlist = (movieId) =>
        watchlist.some((w) => w.movieId === movieId);

    // ---------------- Reviews ----------------
    const addReview = (movie, review) => {
        setMyReviews((prev) => ({ ...prev, [movie.id]: review }));
    };

    // ---------------- Region & Language ----------------
    const [region, setRegion] = useState(
        localStorage.getItem("tmdb_region") ||
        import.meta.env.VITE_TMDB_REGION ||
        "IE"
    );

    const [language, setLanguage] = useState(
        localStorage.getItem("tmdb_language") ||
        import.meta.env.VITE_TMDB_LANGUAGE ||
        "en-US"
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
            favorites,
            addToFavorites,
            removeFromFavorites,

            watchlist,
            addToWatchlist,
            removeFromWatchlist,
            toggleWatchlist, 
            isInWatchlist,

            myReviews,
            addReview,

            region,
            setRegion,
            language,
            setLanguage,
        }),
        [favorites, watchlist, myReviews, region, language]
    );


    return (
        <MoviesContext.Provider value={value}>
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;
