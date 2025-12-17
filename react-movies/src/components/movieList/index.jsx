import Box from "@mui/material/Box";
import MovieCard from "../movieCard";

const MovieList = ({ movies = [], action }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",       //  4 across on desktop
      },
      gap: { xs: 2, md: 3 },        
      alignItems: "stretch",
    }}
  >
    {movies.map((m) => (
      <Box key={m.id}>
        <MovieCard movie={m} action={action} />
      </Box>
    ))}
  </Box>
);

export default MovieList;
