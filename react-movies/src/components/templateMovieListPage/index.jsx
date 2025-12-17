import React, { useState, useMemo } from "react";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";

function MovieListPageTemplate({ movies, title, action, page = 1, totalPages = 1, onPageChange }) {
    const [nameFilter, setNameFilter] = useState("");
    const [genreFilter, setGenreFilter] = useState("0");
    const [sortOrder, setSortOrder] = useState("default");
    const genreId = Number(genreFilter);

    const handleChange = (type, value) => {
        if (type === "name") setNameFilter(value);
        else if (type === "genre") setGenreFilter(value);
        else if (type === "sort") setSortOrder(value);
    };

    const displayedMovies = useMemo(() => {
        let list = movies
            .filter((m) => (m.title || "").toLowerCase().includes(nameFilter.toLowerCase()))
            .filter((m) => (genreId > 0 ? (m.genre_ids || []).includes(genreId) : true));

        const copy = [...list];
        switch (sortOrder) {
            case "release_date.desc":
                return copy.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
            case "release_date.asc":
                return copy.sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""));
            case "title.asc":
                return copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            default:
                return copy;
        }
    }, [movies, nameFilter, genreId, sortOrder]);

    return (
        <Grid container>
            {/* Title + Filter aligned on one row */}
            <Grid item xs={12} sx={{ px: { xs: 1.5, md: 3 }, mb: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                        {title}
                    </Typography>

                    {/* Filter to the right */}
                    <Box sx={{ flexGrow: 1, maxWidth: { xs: "100%", md: 900 }, ml: { md: 2 } }}>
                        <FilterCard
                            onUserInput={handleChange}
                            titleFilter={nameFilter}
                            genreFilter={genreFilter}
                            sortOrder={sortOrder}
                        />
                    </Box>
                </Box>
            </Grid>

            {/* Movie Grid + Pagination */}
            <Grid item xs={12} sx={{ px: { xs: 1.5, md: 3 } }}>
                <MovieList action={action} movies={displayedMovies} />
                {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 4 }}>
                        <Pagination
                            count={Math.min(totalPages, 500)}
                            page={page}
                            onChange={onPageChange}
                            shape="rounded"
                            color="primary"
                            siblingCount={1}
                            boundaryCount={1}
                        />
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}

export default MovieListPageTemplate;
