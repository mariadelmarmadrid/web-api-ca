/**
 * Cast & Crew Page
 * Displays full cast and crew lists for a movie
 * - Fetches credits via `getMovieCredits` and movie title via `getMovie`
 * - Groups crew by department and shows cast in a grid
 */
import React, { useContext } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieCredits, getMovie } from "../api/tmdb-api";
import { MoviesContext } from "../contexts/moviesContextValue";

import Spinner from "../components/spinner";
import {
    Avatar, Box, Breadcrumbs, Card, CardActionArea, CardContent, CardMedia,
    Chip, Container, Grid, Stack, Typography
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonIcon from "@mui/icons-material/Person";

const CastAndCrewPage = () => {
    const { id } = useParams();
    const { language } = useContext(MoviesContext);

    const { data: credits, isPending, isError, error } = useQuery({
        queryKey: ["credits-full", { id, language }],
        queryFn: getMovieCredits,
    });

    const { data: movie } = useQuery({
        queryKey: ["movie-title", { id, language }],
        queryFn: getMovie,
    });

    if (isPending) return <Spinner />;
    if (isError) return <Typography color="error">{error.message}</Typography>;

    const cast = credits?.cast ?? [];
    const crew = credits?.crew ?? [];

    // Optional: group crew by department
    const byDept = crew.reduce((acc, p) => {
        const key = p.department || "Other";
        (acc[key] ||= []).push(p);
        return acc;
    }, {});

    return (
        <Container sx={{ mt: 3, mb: 6 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
                <Link to="/">Home</Link>
                <Link to={`/movies/${id}`}>{movie?.title || "Movie"}</Link>
                <Typography color="text.primary">Cast &amp; Crew</Typography>
            </Breadcrumbs>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                {movie?.title} — Cast &amp; Crew
            </Typography>

            {/* Cast */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Cast</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {cast.map((person) => (
                    <Grid key={`${person.id}-${person.credit_id || person.cast_id}`} item xs={6} sm={4} md={3} lg={2}>
                        <Card elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 3 }}>
                            <CardActionArea component={Link} to={`/person/${person.id}`}>
                                {person.profile_path ? (
                                    <CardMedia
                                        component="img"
                                        image={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                                        alt={person.name}
                                        sx={{ height: 260, objectFit: "cover" }}
                                    />
                                ) : (
                                    <Box sx={{ height: 260, display: "grid", placeItems: "center", bgcolor: "grey.200" }}>
                                        <Avatar sx={{ width: 72, height: 72 }}>
                                            <PersonIcon />
                                        </Avatar>
                                    </Box>
                                )}
                                <CardContent sx={{ py: 1.25 }}>
                                    <Typography variant="subtitle2" fontWeight={700} noWrap>{person.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {person.character || "Cast"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Crew */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Crew</Typography>

            <Stack spacing={3}>
                {Object.entries(byDept).map(([dept, people]) => (
                    <Box key={dept}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{dept}</Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {people.map((p) => (
                                <Chip
                                    key={`${p.id}-${p.credit_id}`}
                                    label={`${p.name} — ${p.job}`}
                                    component={Link}
                                    to={`/person/${p.id}`}
                                    clickable
                                    variant="outlined"
                                    sx={{ borderColor: "rgba(123,31,162,0.35)" }}
                                />
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Container>
    );
};

export default CastAndCrewPage;
