import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContextValue";
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import WriteReview from "../components/cardIcons/writeReview";

const FavoriteMoviesPage = () => {
    const { favorites } = useContext(MoviesContext);

    // Convert favorites into MovieCard-compatible objects
    const movies = favorites.map((fav) => ({
        id: fav.movieId,
        title: fav.title,
        poster_path: fav.poster_path,
    }));

    return (
        <PageTemplate
            title="Favorite Movies"
            movies={movies}
            action={(movie) => (
                <>
                    <RemoveFromFavorites movie={movie} />
                    <WriteReview movie={movie} />
                </>
            )}
        />
    );
};

export default FavoriteMoviesPage;
