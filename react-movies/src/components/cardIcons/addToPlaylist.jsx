import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { MoviesContext } from "../../contexts/moviesContextValue";

const AddToPlaylistIcon = ({ movie }) => {
    const { isInWatchlist, toggleWatchlist } = useContext(MoviesContext);

    // Check if the movie is currently in the watchlist
    const inList = isInWatchlist(movie.id);

    const handleToggle = (e) => {
        e.preventDefault(); // prevent navigating when clicking inside the card
        toggleWatchlist(movie.id);
    };

    return (
        <Tooltip title={inList ? "Remove from Watchlist" : "Add to Watchlist"}>
            <IconButton aria-label="toggle watchlist" onClick={handleToggle}>
                {inList ? (
                    <PlaylistRemoveIcon color="primary" fontSize="large" />
                ) : (
                    <PlaylistAddIcon color="primary" fontSize="large" />
                )}
            </IconButton>
        </Tooltip>
    );
};

export default AddToPlaylistIcon;
