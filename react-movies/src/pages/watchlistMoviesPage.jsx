import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContextValue";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";

const WatchlistMoviesPage = () => {
    const { watchlist } = useContext(MoviesContext);

    if (!watchlist || watchlist.length === 0) {
        return (
            <PageTemplate
                title="Watchlist Movies"
                movies={[]}
                action={(movie) => <AddToFavoritesIcon movie={movie} />}
            />
        );
    }

    const movieQueries = useQueries({
        queries: watchlist.map((item) => ({
            queryKey: ["movie", { id: item.movieId }],
            queryFn: getMovie,
        })),
    });

    const isLoading = movieQueries.some((q) => q.isLoading);
    if (isLoading) return <Spinner />;

    const movies = movieQueries.map((q) => {
        q.data.genre_ids = q.data.genres.map((g) => g.id);
        return q.data;
    });

    return (
        <PageTemplate
            title="Watchlist Movies"
            movies={movies}
            action={(movie) => <AddToFavoritesIcon movie={movie} />}
        />
    );
};

export default WatchlistMoviesPage;
