const BASE_URL = "http://localhost:8080/api/favorites";

const authHeader = () => ({
    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    "Content-Type": "application/json",
});

// GET favorites
export const getFavorites = async () => {
    const response = await fetch(BASE_URL, {
        headers: authHeader(),
    });
    return response.json();
};

// ADD favorite
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

// REMOVE favorite
export const removeFavorite = async (movieId) => {
    await fetch(`${BASE_URL}/${movieId}`, {
        method: "DELETE",
        headers: authHeader(),
    });
};
