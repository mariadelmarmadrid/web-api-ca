/**
 * Movie Details Page
 * Shows detailed information about a single movie
 * - Fetches movie details via `getMovie`
 * - Renders `MovieDetails`, `MovieCredits` and `MovieRecommendations`
 * - Uses `MoviesContext` for region/language
 */
import React, { useContext } from "react";
import { useParams } from 'react-router';
import MovieDetails from "../components/movieDetails/";
import PageTemplate from "../components/templateMoviePage";
import MovieCredits from "../components/movieCredits/";
import MovieRecommendations from "../components/movieRecommendations/";
import { getMovie } from '../api/tmdb-api'
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner'
import { MoviesContext } from '../contexts/moviesContextValue';

const MoviePage = () => {
    const { id } = useParams();
    const { region, language } = useContext(MoviesContext);
    const { data: movie, error, isPending, isError } = useQuery({
        queryKey: ['movie', { id: id, region, language }],
        queryFn: getMovie,
    })

    if (isPending) {
        return <Spinner />;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }


    return (
        <>
            {movie ? (
                <>
                    <PageTemplate movie={movie}>
                        <MovieDetails movie={movie} />
                        <MovieCredits movieId={movie.id} />
                        <MovieRecommendations movieId={movie.id} />
                    </PageTemplate>
                </>
            ) : (
                <p>Waiting for movie details</p>
            )}
        </>
    );
};

export default MoviePage;
