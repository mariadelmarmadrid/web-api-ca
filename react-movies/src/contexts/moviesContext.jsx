import React, { useState, useEffect, useMemo } from "react";
import { MoviesContext } from "./moviesContextValue";
import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from "../api/favorites-api";


const safeParse = (key, fallback) => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch {
        return fallback;
    }
};

const MoviesContextProvider = (props) => {
    // Favorites 
    const [favorites, setFavorites] = useState([]);

    // Reviews
    const [myReviews, setMyReviews] = useState({});

    // Watchlist 
    const [watchlist, setWatchlist] = useState(() =>
        safeParse("watchlistIds", [])
    );

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        if (token) {
            getFavorites().then(setFavorites);
        } else {
            setFavorites([]);
        }
    }, []);


    // Region & language
    const [region, setRegion] = useState(() => {
        try {
            return (
                localStorage.getItem("tmdb_region") ||
                import.meta.env.VITE_TMDB_REGION ||
                "IE"
            );
        } catch {
            return import.meta.env.VITE_TMDB_REGION || "IE";
        }
    });

    const [language, setLanguage] = useState(() => {
        try {
            return (
                localStorage.getItem("tmdb_language") ||
                import.meta.env.VITE_TMDB_LANGUAGE ||
                "en-US"
            );
        } catch {
            return import.meta.env.VITE_TMDB_LANGUAGE || "en-US";
        }
    });

    // ---------------- Favorites ----------------
    const addToFavorites = async (movie) => {
        const newFavorite = await addFavorite(movie);
        setFavorites((prev) =>
            prev.some((f) => f.movieId === newFavorite.movieId)
                ? prev
                : [...prev, newFavorite]
        );
    };

    const removeFromFavorites = async (movie) => {
        const fav = favorites.find((f) => f.movieId === movie.id);
        if (!fav) return;

        await removeFavorite(fav._id);

        setFavorites((prev) =>
            prev.filter((f) => f._id !== fav._id)
        );
    };


    // ---------------- Reviews ----------------
    const addReview = (movie, review) => {
        setMyReviews((prev) => ({ ...prev, [movie.id]: review }));
    };

    // ---------------- Watchlist ----------------
    const addToWatchlist = (movie) => {
        setWatchlist((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
    };

    const removeFromWatchlist = (movie) => {
        setWatchlist((prev) => prev.filter((id) => id !== movie.id));
    };

    const toggleWatchlist = (movieId) => {
        setWatchlist((prev) =>
            prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
        );
    };

    const isInWatchlist = (movieId) => watchlist.includes(movieId);

    // ---------------- Persist ----------------
    useEffect(() => {
        try {
            localStorage.setItem("watchlistIds", JSON.stringify(watchlist));
        } catch { }
    }, [watchlist]);

    useEffect(() => {
        try {
            localStorage.setItem("tmdb_region", region);
        } catch { }
    }, [region]);

    useEffect(() => {
        try {
            localStorage.setItem("tmdb_language", language);
        } catch { }
    }, [language]);

    const value = useMemo(
        () => ({
            // favorites
            favorites,
            addToFavorites,
            removeFromFavorites,

            // reviews
            myReviews,
            addReview,

            // watchlist
            watchlist,
            addToWatchlist,
            removeFromWatchlist,
            toggleWatchlist,
            isInWatchlist,

            // settings
            region,
            setRegion,
            language,
            setLanguage,
        }),
        [favorites, myReviews, watchlist, region, language]
    );

    return <MoviesContext.Provider value={value}>{props.children}</MoviesContext.Provider>;
};

export default MoviesContextProvider;
