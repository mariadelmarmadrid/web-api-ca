import React, { useContext } from "react";
import { Link } from "react-router";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarRateIcon from "@mui/icons-material/StarRate";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import img from "../../images/film-poster-placeholder.png";
import { formatReleaseDate } from "../../util";
import { MoviesContext } from "../../contexts/moviesContextValue";
import AddToPlaylistIcon from "../cardIcons/addToPlaylist"; 

export default function MovieCard({ movie, action }) {
  const { favorites, language } = useContext(MoviesContext);
  const isFav = favorites.includes(movie.id);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : img;

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "—";

  const release = formatReleaseDate(movie.release_date, language) || "TBA";

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
        outline: "1px solid transparent",
        transition: "transform .18s, box-shadow .18s, outline-color .18s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 32px rgba(0,0,0,.18)",
          outlineColor: "rgba(93, 53, 247, .25)",
        },
      }}
    >


      {/* Whole card navigates to details */}
      <CardActionArea component={Link} to={`/movies/${movie.id}`} sx={{ alignItems: "stretch" }}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={poster}
            alt={movie.title}
            sx={{ height: 420, objectFit: "cover", display: "block" }}
          />

          {/* Rating badge */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              px: 1,
              py: 0.25,
              borderRadius: 999,           
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <StarRateIcon sx={{ fontSize: 16 }} />
            {rating}
          </Box>


          {/* Favorite badge */}
          {isFav && (
            <Avatar
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 28,
                height: 28,
                bgcolor: "error.main",
              }}
            >
              <FavoriteIcon sx={{ fontSize: 18, color: "white" }} />
            </Avatar>
          )}
        </Box>

        <CardContent sx={{ pb: 1 }}>
          {/* Title: wrap to multiple lines, same visual height on all cards */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              lineHeight: 1.25,
              display: "-webkit-box",      
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,         
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              minHeight: "calc(1.25em * 2)", // reserve space so row heights align
              mb: 0.5,
            }}
          >
            {movie.title}
          </Typography>



          {/* Meta */}
          <Grid container spacing={1} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                <CalendarIcon sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                {release}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>

      {/* Bottom actions: favorite (via action(movie)) + watchlist icon */}
      <CardActions
        sx={{
          mt: "auto",
          px: 1.5,
          pb: 1.5,
          pt: 0.5,
          display: "flex",
          justifyContent: "space-between",
          "& .MuiIconButton-root": {
            color: "primary.main",
            "&:hover": { color: "primary.light" },
          },
        }}
      >
        {action(movie)}
        <AddToPlaylistIcon movie={movie} />
      </CardActions>

    </Card>
  );
}
