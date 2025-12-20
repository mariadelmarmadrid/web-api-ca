import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Rating from "@mui/material/Rating";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import {
    getUserReviews,
    deleteReview,
} from "../api/reviews-api";
import { getMovie } from "../api/tmdb-api";

const styles = {
    root: {
        padding: 3,
    },
    card: {
        marginBottom: 2,
        transition: "all 0.3s ease",
        "&:hover": {
            boxShadow: 4,
            transform: "translateY(-4px)",
        },
    },
    cardContent: {
        paddingBottom: 1,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: 2,
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
    },
    ratingContainer: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        marginBottom: 1.5,
    },
};

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [movieTitles, setMovieTitles] = useState({});

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = () => {
        setLoading(true);
        setError(null);
        getUserReviews()
            .then((data) => {
                const reviewsList = Array.isArray(data) ? data : [];
                setReviews(reviewsList);
                // Fetch movie titles for each review
                reviewsList.forEach((review) => {
                    if (!movieTitles[review.movieId]) {
                        getMovie({ queryKey: ["movie", { id: review.movieId }] })
                            .then((movie) => {
                                setMovieTitles((prev) => ({
                                    ...prev,
                                    [review.movieId]: movie.title,
                                }));
                            })
                            .catch((err) => {
                                console.error(`Failed to load movie ${review.movieId}`, err);
                                setMovieTitles((prev) => ({
                                    ...prev,
                                    [review.movieId]: `Movie #${review.movieId}`,
                                }));
                            });
                    }
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load reviews", err);
                setError("Failed to load your reviews. Please try again later.");
                setLoading(false);
            });
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirm(id);
    };

    const handleConfirmDelete = () => {
        if (deleteConfirm) {
            deleteReview(deleteConfirm)
                .then(() => {
                    setReviews((prev) => prev.filter((r) => r._id !== deleteConfirm));
                    setDeleteConfirm(null);
                })
                .catch((err) => {
                    console.error("Failed to delete review", err);
                    setError("Failed to delete review. Please try again.");
                });
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    if (loading) {
        return (
            <Box sx={styles.loadingContainer}>
                <Stack alignItems="center" gap={2}>
                    <CircularProgress />
                    <Typography variant="h6">Loading your reviews...</Typography>
                </Stack>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={styles.root}>
            <Box sx={styles.header}>
                <Typography variant="h4" component="h1">
                    My Reviews
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}

            {reviews.length === 0 ? (
                <Box sx={styles.emptyState}>
                    <Typography variant="h5" color="textSecondary">
                        No reviews yet
                    </Typography>
                    <Typography variant="body1" color="textSecondary" textAlign="center">
                        You haven't written any reviews yet. Start by adding a review to your favorite movies!
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {reviews.map((review) => (
                        <Card key={review._id} sx={styles.card}>
                            <CardContent sx={styles.cardContent}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "start",
                                        marginBottom: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {movieTitles[review.movieId] || "Loading..."}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                    >
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Box sx={styles.ratingContainer}>
                                    <Rating value={review.rating} readOnly size="medium" />
                                    <Typography variant="body2" color="textSecondary">
                                        ({review.rating}/5)
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.6,
                                        color: "text.primary",
                                    }}
                                >
                                    {review.content}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: "flex-end" }}>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleDeleteClick(review._id)}
                                >
                                    Delete Review
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            )}

            <Dialog
                open={deleteConfirm !== null}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Delete Review?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this review? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyReviewsPage;
