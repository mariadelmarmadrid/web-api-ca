const { VITE_TMDB_KEY, VITE_TMDB_LANGUAGE, VITE_TMDB_REGION } = import.meta.env;
const API_BASE = "http://localhost:8080/api/movies";

// --- helpers 

const defaultLang = VITE_TMDB_LANGUAGE || "en-US";
const defaultRegion = VITE_TMDB_REGION || "IE";


async function fetchAPI(path, params = {}) {
    const url = new URL(`${API_BASE}/${path}`);

    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
            url.searchParams.set(k, v);
        }
    });

    const res = await fetch(url.toString());

    if (!res.ok) {
        let payload;
        try {
            payload = await res.json();
        } catch {
            // ignore
        }

        const message =
            (payload && payload.message) ||
            `API error ${res.status}`;

        throw new Error(message);
    }

    return res.json();
}

/**
 * Safely extract common options from a React Query queryKey.
 * Expected usage: ['key', { language, region, page, id }]
 */
function optsFromKey(args) {
    const qk = args?.queryKey || [];
    const second = qk[1] || {};
    return {
        language: second.language || defaultLang,
        region: second.region || defaultRegion,
        page: Number(second.page || 1),
        id: second.id,
    };
}

// --- Movies: discovery & lists

/**
 * Discover movies (Home). Supports pagination.
 * queryKey: ['discover', { language, region, page }]
 */
export const getMovies = (args) => {
  const { language, region, page } = optsFromKey(args);
  return fetchAPI("discover", { language, region, page });
};


/**
 * Popular movies. Supports pagination.
 * queryKey: ['popularMovies', { language, region, page }]
 */
export const getPopularMovies = (args) => {
    const { language, region, page } = optsFromKey(args);
    return fetchAPI("popular", { language, region, page });
};


/**
 * Now Playing. Supports pagination.
 * queryKey: ['nowPlayingMovies', { language, region, page }]
 */
export const getNowPlayingMovies = (args) => {
    const { language, region, page } = optsFromKey(args);
    return fetchAPI("now-playing", { language, region, page });
};

/**
 * Upcoming. Supports pagination.
 * queryKey: ['upcomingMovies', { language, region, page }]
 */
export const getUpcomingMovies = (args) => {
    const { language, region, page } = optsFromKey(args);
    return fetchAPI("upcoming", {
        language,
        region,
        page,
        include_adult: "false",
        include_video: "false",
    });
};

/**
 * Top Rated. Supports pagination.
 * queryKey: ['topRatedMovies', { language, region, page }]
 */
export const getTopRatedMovies = (args) => {
    const { language, region, page } = optsFromKey(args);
    return fetchAPI("top-rated", { language, region, page });
};

// --- Single movie & related

/**
 * Single movie details.
 * queryKey: ['movie', { id, language }]
 */
export const getMovie = (args) => {
    const { id, language } = optsFromKey(args);
    return fetchAPI(`${id}`, { language });
};

/**
 * Movie images (posters/backdrops).
 * queryKey: ['images', { id }]
 */
export const getMovieImages = (args) => {
    const { id } = optsFromKey(args);
    return fetchAPI(`${id}/images`);
};

/**
 * Movie reviews.
 * queryKey: ['reviews', { id, language }]
 */
export const getMovieReviews = (args) => {
    const { id, language } = optsFromKey(args);
    return fetchAPI(`${id}/reviews`, { language });
};

/**
 * Movie recommendations.
 * queryKey: ['recommendations', { id, language, page }]
 */
export const getMovieRecommendations = (args) => {
    const { id, language, page } = optsFromKey(args);
    return fetchAPI(`${id}/recommendations`, { language, page });
};

/**
 * Movie credits (cast/crew).
 * queryKey: ['credits', { id, language }]
 */
export const getMovieCredits = (args) => {
    const { id, language } = optsFromKey(args);
    return fetchAPI(`${id}/credits`, { language });
};

// --- Genres

/**
 * Genres list.
 * queryKey: ['genres', { language }]
 */
export const getGenres = () => {
    return fetchAPI("genres");
};

// --- People

/**
 * Person details.
 * queryKey: ['person', { id, language }]
 */
export const getPerson = (args) => {
    const { id, language } = optsFromKey(args);
    return fetchAPI(`person/${id}`, { language });
};

/**
 * Person movie credits.
 * queryKey: ['personMovieCredits', { id, language }]
 */
export const getPersonMovieCredits = (args) => {
    const { id, language } = optsFromKey(args);
    return fetchAPI(`person/${id}/movie_credits`, { language });
};