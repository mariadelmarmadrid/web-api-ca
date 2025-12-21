/**
 * Reviews API
 * Client-side API calls for managing movie reviews
 * All requests include JWT token from localStorage
 */

const API_URL = "http://localhost:8080/api/reviews";

/**
 * Fetch all reviews written by the logged-in user
 * GET /api/reviews
 * Returns: Promise<Array> - Array of review objects created by user
 */
export const getUserReviews = () => {
    return fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then((res) => res.json());
};

/**
 * Create a new review for a movie
 * POST /api/reviews
 * Sends: { movieId, content, rating }
 * Returns: Promise<Object> - Created review object
 * Throws: Error with message from server if review fails
 */
export const addReview = async (review) => {
    const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(review),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};

/**
 * Delete a review written by the logged-in user
 * DELETE /api/reviews/:id
 * Param: id - MongoDB ID of the review to delete
 * Returns: Promise<Response>
 */
export const deleteReview = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

/**
 * Fetch all reviews for a specific movie
 * GET /api/reviews/movie/:movieId
 * Param: movieId - TMDB movie ID
 * Returns: Promise<Array> - Array of review objects for the movie
 */
export const getMovieReviews = (movieId) => {
    return fetch(`${API_URL}/movie/${movieId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then((res) => res.json());
};
