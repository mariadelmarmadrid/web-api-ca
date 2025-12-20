import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContextValue";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";

const WatchlistMoviesPage = () => {
    const { watchlist } = useContext(MoviesContext);

    if (!watchlist || watchlist.length === 0) {
        return (
            <PageTemplate
                title="Watchlist Movies"
                movies={[]}
                action={(movie) => <AddToPlaylistIcon movie={movie} />}
            />
        );
    }

    // 🔒 FILTER INVALID ENTRIES
    const validWatchlist = watchlist.filter(
        (item) => typeof item.movieId === "number"
    );

    const movieQueries = useQueries({
        queries: validWatchlist.map((item) => ({
            queryKey: ["movie", { id: item.movieId }],
            queryFn: getMovie,
        })),
    });

    const isPending = movieQueries.some((q) => q.isPending);
    if (isPending) return <Spinner />;

    const movies = movieQueries
        .filter((q) => q.data)
        .map((q) => {
            const movie = { ...q.data };
            movie.genre_ids = movie.genres?.map((g) => g.id) || [];
            return movie;
        });

    return (
        <PageTemplate
            title="Watchlist Movies"
            movies={movies}
            action={(movie) => <AddToPlaylistIcon movie={movie} />}
        />
    );
};

export default WatchlistMoviesPage;
