/**
 * Watchlist API
 * Client-side API calls for managing user's watchlist
 * All requests include JWT token from localStorage
 */

const API_BASE = "http://localhost:8080/api/watchlist";

/**
 * Helper function to create authorization headers
 * Retrieves JWT token from localStorage
 */
const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/**
 * Fetch the logged-in user's watchlist
 * GET /api/watchlist
 * Returns: Promise<Array> - Array of watchlist item objects
 */
export const getWatchlist = async () => {
    const res = await fetch(API_BASE, { headers: authHeader() });
    return res.json();
};

/**
 * Add a movie to the user's watchlist
 * POST /api/watchlist
 * Sends: { movieId, title, poster_path }
 * Returns: Promise<Object> - Created watchlist item object
 * Throws: Error if add fails (e.g., duplicate)
 */
export const addToWatchlist = async (movie) => {
    const payload = {
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
    };

    const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to add to watchlist");
    }

    return res.json();
};

/**
 * Remove a movie from the user's watchlist
 * DELETE /api/watchlist/:id
 * Param: id - MongoDB ID of the watchlist item to remove
 */
export const removeFromWatchlist = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
};
