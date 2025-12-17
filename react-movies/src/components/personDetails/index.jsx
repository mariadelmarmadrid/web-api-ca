import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router';
import KnownForCarousel from "../knownForCarousel";
import FilmographyList from "../filmographyList";

const PersonDetails = ({ person, knownFor = [], filmography = [] }) => {
    return (
        <>
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h4" component="h2">{person.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>{person.known_for_department || ''}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>{person.biography || 'No biography available.'}</Typography>
            </Paper>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Known For</Typography>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1, pb: 2 }}>
                    {knownFor.map((k) => (
                        <Box key={k.credit_id} sx={{ minWidth: 140 }} component={Link} to={`/movies/${k.id}`}>
                            <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                {k.poster_path ? (
                                    <img src={`https://image.tmdb.org/t/p/w500/${k.poster_path}`} alt={k.title || k.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                                ) : (
                                    <Box sx={{ height: 180, bgcolor: 'grey.100' }} />
                                )}
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{k.title || k.name}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Filmography
                </Typography>
                <FilmographyList items={filmography} />
            </Box>
        </>
    );
};

export default PersonDetails;
