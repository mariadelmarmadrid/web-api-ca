/**
 * Now Playing Movies Page
 * Displays currently playing movies (paginated)
 * - Uses `getNowPlayingMovies` and `PageTemplate`
 * - Considers `region` and `language` from `MoviesContext`
 */
import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNowPlayingMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import { MoviesContext } from "../contexts/moviesContextValue";

const NowPlayingMoviesPage = () => {
    const { region, language } = useContext(MoviesContext);
    const [page, setPage] = useState(1);

    const { data, error, isPending, isError } = useQuery({
        queryKey: ["nowPlayingMovies", { region, language, page }],
        queryFn: getNowPlayingMovies,
        keepPreviousData: true,
    });

    if (isPending) return <Spinner />;
    if (isError) return <h1>{error.message}</h1>;

    const handlePage = (_e, p) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <PageTemplate
            title="Now Playing"
            movies={data?.results || []}
            action={(movie) => <AddToFavoritesIcon movie={movie} />}
            page={page}
            totalPages={data?.total_pages ?? 1}
            onPageChange={handlePage}
        />
    );
};

export default NowPlayingMoviesPage;
