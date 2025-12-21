/**
 * Home Page
 * Displays a paginated list of discovered movies (Discover)
 * - Fetches movies via `getMovies` and uses `PageTemplate` for layout
 * - Uses `MoviesContext` for `region` and `language` preferences
 * - Each movie card has an action to add to favorites
 */
import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import { MoviesContext } from "../contexts/moviesContextValue";

const HomePage = () => {
  const { region, language } = useContext(MoviesContext);
  const [page, setPage] = useState(1);

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["discover", { region, language, page }],
    queryFn: getMovies,
    keepPreviousData: true,  // smooth page transitions
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const handlePage = (_evt, p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageTemplate
      title="Discover Movies"
      movies={data?.results || []}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
      page={page}
      totalPages={data?.total_pages ?? 1}
      onPageChange={handlePage}
    />
  );
};

export default HomePage;
