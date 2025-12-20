import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";

import { addReview } from "../../api/reviews-api";

const ratings = [
    { value: 5, label: "Excellent" },
    { value: 4, label: "Good" },
    { value: 3, label: "Average" },
    { value: 2, label: "Poor" },
    { value: 0, label: "Terrible" },
];

const styles = {
    root: {
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
    },
    form: {
        width: "100%",
        "& > * ": {
            marginTop: 2,
        },
    },
    submit: {
        marginRight: 2,
    },
    snack: {
        width: "50%",
        "& > * ": {
            width: "100%",
        },
    },
};

const ReviewForm = ({ movie }) => {
    const [rating, setRating] = useState(3);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            content: "",
            rating: 3,
        },
    });

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const onSubmit = (data) => {
        console.log("SUBMIT CLICKED", data);
        addReview({
            movieId: movie.id,
            content: data.content,
            rating: rating,
        })
            .then(() => setOpen(true))
            .catch((err) => {
                alert(err.message);
            });

    };


    const handleSnackClose = () => {
        setOpen(false);
        reset();
        navigate("/movies/favorites");
    };

    return (
        <Box component="div" sx={styles.root}>
            <Typography component="h2" variant="h3">
                Write a review
            </Typography>

            <Snackbar
                sx={styles.snack}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                onClose={handleSnackClose}
            >
                <MuiAlert
                    severity="success"
                    variant="filled"
                    onClose={handleSnackClose}
                >
                    <Typography variant="h4">
                        Thank you for submitting a review
                    </Typography>
                </MuiAlert>
            </Snackbar>

            <form
                style={styles.form}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                {/* REVIEW TEXT */}
                <Controller
                    name="content"
                    control={control}
                    rules={{
                        required: "Review cannot be empty.",
                        minLength: {
                            value: 10,
                            message: "Review is too short",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Review text"
                            multiline
                            minRows={10}
                            error={!!errors.content}
                            helperText={errors.content?.message}
                        />
                    )}
                />

                {/* RATING SELECT */}
                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Rating"
                            value={rating}
                            onChange={(e) => {
                                field.onChange(e);
                                handleRatingChange(e);
                            }}
                            helperText="Don't forget your rating"
                        >
                            {ratings.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                {/* BUTTONS */}
                <Box sx={{ marginTop: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={styles.submit}
                    >
                        Submit
                    </Button>
                    <Button
                        type="reset"
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                            reset({
                                content: "",
                                rating: 3,
                            })
                        }
                    >
                        Reset
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ReviewForm;
