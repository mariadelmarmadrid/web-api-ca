const API_BASE = "http://localhost:8080/api/watchlist";

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getWatchlist = async () => {
    const res = await fetch(API_BASE, { headers: authHeader() });
    return res.json();
};

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


export const removeFromWatchlist = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
};
