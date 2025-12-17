import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContextValue";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";

const WatchlistMoviesPage = () => {
    const { watchlist: movieIds } = useContext(MoviesContext);


    if (!movieIds || movieIds.length === 0) {
        return (
            <PageTemplate
                title="Watchlist Movies"
                movies={[]}
                action={(movie) => <AddToFavoritesIcon movie={movie} />}
            />
        );
    }

   
    const movieQueries = useQueries({
        queries: movieIds.map((movieId) => ({
            queryKey: ["movie", { id: movieId }],
            queryFn: getMovie,
        })),
    });

    
    const isPending = movieQueries.some((q) => q.isPending);
    if (isPending) return <Spinner />;

  
    const movies = movieQueries
        .filter((q) => q.data)
        .map((q) => {
            const m = { ...q.data };
            m.genre_ids = (m.genres || []).map((g) => g.id);
            return m;
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
