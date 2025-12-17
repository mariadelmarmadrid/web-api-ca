import React, { useContext } from "react";
import { getMovieRecommendations } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Link } from "react-router";
import img from '../../images/film-poster-placeholder.png';

import { MoviesContext } from '../../contexts/moviesContextValue';

const MovieRecommendations = ({ movieId }) => {
    const { language } = useContext(MoviesContext);
    const { data, error, isPending, isError } = useQuery({
        queryKey: ['recommendations', { id: movieId, language }],
        queryFn: getMovieRecommendations,
    });

    if (isPending) {
        return <Spinner />;
    }

    if (isError) {
        return <Typography variant="h6" color="error">Error loading recommendations: {error.message}</Typography>;
    }

    const recommendations = data.results || [];

    if (recommendations.length === 0) {
        return <Typography variant="h6">No recommendations available for this movie.</Typography>;
    }

    return (
        <>
            <Typography variant="h5" component="h3" sx={{ marginTop: 4, marginBottom: 2 }}>
                Recommended Movies
            </Typography>
            <Grid container spacing={2}>
                {recommendations.slice(0, 6).map((movie) => (
                    <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 2 }}>
                        <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ height: '100%' }}>
                                <CardMedia
                                    sx={{ height: 250 }}
                                    image={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                            : img
                                    }
                                    title={movie.title}
                                />
                                <CardContent>
                                    <Typography variant="body2" component="p" noWrap>
                                        {movie.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default MovieRecommendations;
