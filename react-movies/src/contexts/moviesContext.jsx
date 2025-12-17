import React, { useState, useEffect, useMemo } from "react";
import { MoviesContext } from "./moviesContextValue";

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
    const [favorites, setFavorites] = useState(() =>
        safeParse("favoritesIds", [])
    );

    // Reviews
    const [myReviews, setMyReviews] = useState({});

    // Watchlist 
    const [watchlist, setWatchlist] = useState(() =>
        safeParse("watchlistIds", [])
    );

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
    const addToFavorites = (movie) => {
        setFavorites((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
    };

    const removeFromFavorites = (movie) => {
        setFavorites((prev) => prev.filter((id) => id !== movie.id));
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
            localStorage.setItem("favoritesIds", JSON.stringify(favorites));
        } catch { }
    }, [favorites]);

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
