const API_URL = "http://localhost:8080/api/reviews";

export const getUserReviews = () => {
    return fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then((res) => res.json());
};

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

export const deleteReview = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

export const getMovieReviews = (movieId) => {
    return fetch(`${API_URL}/movie/${movieId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then((res) => res.json());
};
