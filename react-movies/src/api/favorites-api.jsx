/**
 * Favorites API
 * Client-side API calls for managing user's favorite movies
 * All requests include JWT token from localStorage
 */

const BASE_URL = "http://localhost:8080/api/favorites";

/**
 * Helper function to create authorization headers
 * Retrieves JWT token from localStorage
 */
const authHeader = () => ({
    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    "Content-Type": "application/json",
});

/**
 * Fetch all favorites for the logged-in user
 * GET /api/favorites
 * Returns: Promise<Array> - Array of favorite movie objects
 */
export const getFavorites = async () => {
    const response = await fetch(BASE_URL, {
        headers: authHeader(),
    });
    return response.json();
};

/**
 * Add a movie to the user's favorites
 * POST /api/favorites
 * Sends: { movieId, title, poster_path }
 * Returns: Promise<Object> - Created favorite object
 */
export const addFavorite = async (movie) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
            movieId: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
        }),
    });
    return response.json();
};

/**
 * Remove a movie from the user's favorites
 * DELETE /api/favorites/:id
 * Param: movieId - MongoDB ID of the favorite to remove
 */
export const removeFavorite = async (movieId) => {
    await fetch(`${BASE_URL}/${movieId}`, {
        method: "DELETE",
        headers: authHeader(),
    });
};
