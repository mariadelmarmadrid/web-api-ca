/**
 * Movie Review Page
 * Displays a single review for a movie inside the page template
 * - Expects `movie` and `review` to be passed via `location.state`
 * - Renders `MovieReview` inside `PageTemplate`
 */
import React from "react";
import { useLocation } from "react-router";
import PageTemplate from "../components/templateMoviePage";
import MovieReview from "../components/movieReview";

const MovieReviewPage = () => {
    let location = useLocation();
    const { movie, review } = location.state;

    return (
        <PageTemplate movie={movie}>
            <MovieReview review={review} />
        </PageTemplate>
    );
};

export default MovieReviewPage;
