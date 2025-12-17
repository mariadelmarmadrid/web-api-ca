import React, { useContext } from "react";
import { getMovieCredits } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { MoviesContext } from '../../contexts/moviesContextValue';

const MovieCredits = ({ movieId }) => {
    const { language } = useContext(MoviesContext);
    const { data, error, isPending, isError } = useQuery({
        queryKey: ['credits', { id: movieId, language }],
        queryFn: getMovieCredits,
    });

    if (isPending) return <Spinner />;
    if (isError) return <Typography variant="h6" color="error">Error loading credits: {error.message}</Typography>;

    const cast = data.cast || [];
    const crew = data.crew || [];

    const director = crew.find(person => person.job === "Director");
    const producers = crew.filter(person => person.job === "Producer").slice(0, 2);
    const writers = crew.filter(person => person.department === "Writing").slice(0, 2);

    return (
        <>
            {/* Cast header + "More" */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 4, mb: 2 }}>
                <Typography variant="h5" component="h3">Cast</Typography>
                {cast.length > 6 && (
                    <Button
                        component={Link}
                        to={`/movies/${movieId}/cast`}
                        size="small"
                        endIcon={<ChevronRightIcon />}
                        sx={{ textTransform: "none" }}
                    >
                        More
                    </Button>
                )}
            </Box>

            {cast.length === 0 ? (
                <Typography variant="body1">No cast information available.</Typography>
            ) : (
                <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                    {cast.slice(0, 6).map((person) => (
                        <Grid key={person.id} item xs={6} sm={4} md={2}>
                            <Card sx={{ height: '100%' }} component={Link} to={`/person/${person.id}`}>
                                {person.profile_path ? (
                                    <CardMedia
                                        sx={{ height: 250 }}
                                        image={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                                        title={person.name}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: '100%', height: 250, borderRadius: 0, bgcolor: 'grey.300',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: 80 }} />
                                    </Avatar>
                                )}
                                <CardContent>
                                    <Typography variant="body2" fontWeight="bold" noWrap>
                                        {person.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {person.character}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Crew Section */}
            <Typography variant="h5" component="h3" sx={{ marginTop: 2, marginBottom: 2 }}>
                Crew
            </Typography>
            <Grid container spacing={2}>
                {director && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" fontWeight="bold">Director</Typography>
                        <Typography variant="body2">{director.name}</Typography>
                    </Grid>
                )}
                {producers.length > 0 && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" fontWeight="bold">Producers</Typography>
                        {producers.map(producer => (
                            <Typography key={producer.id} variant="body2">{producer.name}</Typography>
                        ))}
                    </Grid>
                )}
                {writers.length > 0 && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" fontWeight="bold">Writers</Typography>
                        {writers.map(writer => (
                            <Typography key={writer.id} variant="body2">{writer.name}</Typography>
                        ))}
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default MovieCredits;
