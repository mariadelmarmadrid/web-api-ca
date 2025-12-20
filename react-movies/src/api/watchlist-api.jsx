const API_BASE = "http://localhost:8080/api/watchlist";

const authHeader = () => ({
    Authorization: localStorage.getItem("token"),
});

export const getWatchlist = async () => {
    const res = await fetch(API_BASE, { headers: authHeader() });
    return res.json();
};

export const addWatchlist = async (movie) => {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        },
        body: JSON.stringify(movie),
    });
    return res.json();
};

export const removeWatchlist = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
};
