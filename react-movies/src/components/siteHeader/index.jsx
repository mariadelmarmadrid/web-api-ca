import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { MoviesContext } from "../../contexts/moviesContextValue";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";

import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);


const COLORS = {
  gradFrom: "#7E57C2", 
  gradTo: "#AB47BC",   
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.75)",
  pillHover: "rgba(255,255,255,0.14)",
  pillActive: "rgba(255,255,255,0.22)",
  border: "rgba(255,255,255,0.2)",
};

const SiteHeader = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { region, setRegion, language, setLanguage } = useContext(MoviesContext);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const menuOptions = [
        { label: "Home", path: "/" },
        { label: "Favorites", path: "/movies/favorites" },
        { label: "Watchlist", path: "/movies/watchlist" },
        { label: "Popular", path: "/movies/popular" },
        { label: "Now Playing", path: "/movies/now-playing" },
        { label: "Upcoming", path: "/movies/upcoming" },
        { label: "Top Rated", path: "/movies/top-rated" },
    ];

    const isActive = (path) =>
        path === "/"
            ? pathname === "/"
            : pathname.startsWith(path);

    const handleMenuSelect = (pageURL) => {
        setAnchorEl(null);
        navigate(pageURL);
    };

    const handleMenu = (event) => setAnchorEl(event.currentTarget);

    return (
        <>
            <AppBar
                position="fixed"
                elevation={8}
                sx={{
                    backgroundImage: `linear-gradient(90deg, ${COLORS.gradFrom}, ${COLORS.gradTo})`,
                    color: COLORS.text,
                    borderBottom: `1px solid ${COLORS.border}`,
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    {/* Brand */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mr: 1 }}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                bgcolor: "white",
                                borderRadius: "50%",
                                boxShadow: "0 0 0 4px rgba(255,255,255,0.18)",
                            }}
                        />
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 800, letterSpacing: 0.3, lineHeight: 1 }}
                            >
                                TMDB Client
                            </Typography>
                            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                                All you ever wanted to know about Movies!
                            </Typography>
                        </Box>
                    </Box>

                    {/* Center nav */}
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                        {!isMobile && (
                            <Stack direction="row" spacing={1}>
                                {menuOptions.map((opt) => {
                                    const active = isActive(opt.path);
                                    return (
                                        <Button
                                            key={opt.label}
                                            onClick={() => handleMenuSelect(opt.path)}
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: 700,
                                                color: COLORS.text,
                                                px: 1.5,
                                                borderRadius: 999,
                                                opacity: 0.95,
                                                bgcolor: active ? COLORS.pillActive : "transparent",
                                                "&:hover": {
                                                    bgcolor: COLORS.pillHover,
                                                },
                                            }}
                                        >
                                            {opt.label}
                                        </Button>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>

                    {/* Right controls */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {!isMobile && (
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                {/* Language */}
                                <FormControl size="small" sx={{ minWidth: 160 }}>
                                    <InputLabel sx={{ color: COLORS.text }}>
                                        Language
                                    </InputLabel>
                                    <Select
                                        value={language}
                                        label="Language"
                                        onChange={(e) => setLanguage(e.target.value)}
                                        sx={{
                                            color: COLORS.text,
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: COLORS.border,
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: COLORS.text,
                                            },
                                            "& .MuiSvgIcon-root": { color: COLORS.text },
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        <MenuItem value={"en-US"}>English (en-US)</MenuItem>
                                        <MenuItem value={"es-ES"}>Español (es-ES)</MenuItem>
                                        <MenuItem value={"fr-FR"}>Français (fr-FR)</MenuItem>
                                    </Select>
                                </FormControl>

                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{ bgcolor: COLORS.border }}
                                />

                                {/* Region */}
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <InputLabel sx={{ color: COLORS.text }}>Region</InputLabel>
                                    <Select
                                        value={region}
                                        label="Region"
                                        onChange={(e) => setRegion(e.target.value)}
                                        sx={{
                                            color: COLORS.text,
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: COLORS.border,
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: COLORS.text,
                                            },
                                            "& .MuiSvgIcon-root": { color: COLORS.text },
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        <MenuItem value={"IE"}>Ireland (IE)</MenuItem>
                                        <MenuItem value={"US"}>United States (US)</MenuItem>
                                        <MenuItem value={"GB"}>United Kingdom (GB)</MenuItem>
                                        <MenuItem value={"ES"}>Spain (ES)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        )}

                        
                    </Box>
                </Toolbar>
            </AppBar>
            <Offset />
        </>
    );
};

export default SiteHeader;
