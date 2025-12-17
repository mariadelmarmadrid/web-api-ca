import React, { useContext } from "react";
import { getUpcomingMovies } from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites';
import { todayLocalISODate } from "../util";
import { MoviesContext } from '../contexts/moviesContextValue';



const UpcomingMoviesPage = () => {

    const { region, language } = useContext(MoviesContext);
    const { data, error, isPending, isError } = useQuery({
        queryKey: ['upcomingMovies', { region, language }],
        queryFn: getUpcomingMovies,
    })

    if (isPending) {
        return <Spinner />
    }

    if (isError) {
        return <h1>{ error.message } </h1>
    }

    const movies = data.results;

    // Keep only movies that have not been released yet by local date
    const today = todayLocalISODate();
    const unreleasedMovies = movies.filter((m) => m.release_date && m.release_date > today);

    return (
        <PageTemplate
            title="Upcoming Movies"
            movies={data?.results || []}
            action={(movie) => <AddToFavoritesIcon movie={movie} />}
        />
    );

};
export default UpcomingMoviesPage;
