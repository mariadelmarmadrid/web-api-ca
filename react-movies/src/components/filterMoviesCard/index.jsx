import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { getGenres } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";

export default function FilterMoviesCard(props) {
    const { data, error, isPending, isError } = useQuery({
        queryKey: ["genres"],
        queryFn: getGenres,
    });

    if (isPending) return <Spinner />;
    if (isError) return <h1>{error.message}</h1>;

    const genres = [...data.genres];
    if (!genres.length || genres[0].name !== "All") {
        genres.unshift({ id: "0", name: "All" });
    }

    const handle = (type) => (e) => props.onUserInput(type, e.target.value);

    const purple = "#d1c4e9"; 
    const border = "#b39ddb"; 
    const text = "#1a1a1a";

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 5,
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                bgcolor: purple,
                border: `1px solid ${border}`,
                boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
            }}
        >
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ width: "100%", flexWrap: "wrap" }}
            >
                {/* Left Label */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        color: text,
                    }}
                >
                    <SearchIcon sx={{ color: text, fontSize: 20 }} />
                    Filter Movies
                </Typography>

                {/* Search Box */}
                <TextField
                    label="Search"
                    type="search"
                    value={props.titleFilter}
                    onChange={handle("name")}
                    size="small"
                    sx={{
                        flexGrow: 1,
                        minWidth: 180,
                        "& .MuiOutlinedInput-root": {
                            bgcolor: purple,
                            borderRadius: 2,
                            "& fieldset": { borderColor: border },
                            "&:hover fieldset": { borderColor: "#9575cd" },
                            "&.Mui-focused fieldset": { borderColor: "#7e57c2", borderWidth: 2 },
                        },
                    }}
                />

                {/* Genre Selector */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ color: text }}>Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        id="genre-select"
                        label="Genre"
                        value={props.genreFilter}
                        onChange={handle("genre")}
                        sx={{
                            bgcolor: purple,
                            borderRadius: 2,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9575cd" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7e57c2" },
                        }}
                    >
                        {genres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                                {genre.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Sort Selector */}
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel sx={{ color: text }}>Sort by</InputLabel>
                    <Select
                        labelId="sort-label"
                        id="sort-select"
                        label="Sort by"
                        value={props.sortOrder || "default"}
                        onChange={handle("sort")}
                        sx={{
                            bgcolor: purple,
                            borderRadius: 2,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9575cd" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7e57c2" },
                        }}
                    >
                        <MenuItem value="default">Default (API order)</MenuItem>
                        <MenuItem value="release_date.desc">Newest</MenuItem>
                        <MenuItem value="release_date.asc">Oldest</MenuItem>
                        <MenuItem value="title.asc">Title A–Z</MenuItem>
                    </Select>
                </FormControl>

                {/* Tip */}
                <Box sx={{ color: text, fontSize: 12, whiteSpace: "nowrap" }}>
                    tip: search + genre + sort
                </Box>
            </Stack>
        </Card>
    );
}
