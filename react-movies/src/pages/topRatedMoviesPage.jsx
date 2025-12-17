import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTopRatedMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import { MoviesContext } from "../contexts/moviesContextValue";

const TopRatedMoviesPage = () => {
    const { region, language } = useContext(MoviesContext);
    const [page, setPage] = useState(1);

    const { data, error, isPending, isError } = useQuery({
        queryKey: ["topRatedMovies", { region, language, page }],
        queryFn: getTopRatedMovies,
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
            title="Top Rated Movies"
            movies={data?.results || []}
            action={(movie) => <AddToFavoritesIcon movie={movie} />}
            page={page}
            totalPages={data?.total_pages ?? 1}
            onPageChange={handlePage}
        />
    );
};

export default TopRatedMoviesPage;
