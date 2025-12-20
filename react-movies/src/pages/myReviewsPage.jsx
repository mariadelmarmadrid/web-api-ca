import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import {
    getUserReviews,
    deleteReview,
} from "../api/reviews-api";

const styles = {
    root: {
        padding: 3,
    },
    card: {
        marginBottom: 3,
    },
    movieId: {
        fontWeight: "bold",
    },
};

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserReviews()
            .then((data) => {
                setReviews(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load reviews", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        deleteReview(id).then(() => {
            setReviews((prev) => prev.filter((r) => r._id !== id));
        });
    };

    if (loading) {
        return (
            <Typography variant="h5" sx={{ padding: 3 }}>
                Loading reviews...
            </Typography>
        );
    }

    return (
        <Box sx={styles.root}>
            <Typography variant="h4" gutterBottom>
                My Reviews
            </Typography>

            {reviews.length === 0 ? (
                <Typography variant="h6">
                    You have not written any reviews yet.
                </Typography>
            ) : (
                reviews.map((review) => (
                    <Card key={review._id} sx={styles.card}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={styles.movieId}
                            >
                                Movie ID: {review.movieId}
                            </Typography>

                            <Divider sx={{ marginY: 1 }} />

                            <Typography variant="subtitle1">
                                Rating: {review.rating}
                            </Typography>

                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                {review.content}
                            </Typography>
                        </CardContent>

                        <CardActions>
                            <Button
                                size="small"
                                color="error"
                                onClick={() => handleDelete(review._id)}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default MyReviewsPage;
