import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPopularMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import { MoviesContext } from "../contexts/moviesContextValue";

const PopularMoviesPage = () => {
    const { region, language } = useContext(MoviesContext);
    const [page, setPage] = useState(1);

    const { data, error, isPending, isError } = useQuery({
        queryKey: ["popularMovies", { region, language, page }],
        queryFn: getPopularMovies,
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
            title="Popular Movies"
            movies={data?.results || []}
            action={(movie) => <AddToFavoritesIcon movie={movie} />}
            page={page}
            totalPages={data?.total_pages ?? 1}
            onPageChange={handlePage}
        />
    );
};

export default PopularMoviesPage;
