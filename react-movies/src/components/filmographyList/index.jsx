import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router';

const rowSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    px: 1,
    py: 1,
    textDecoration: 'none',
    color: 'inherit',
    borderRadius: 1,
    '&:hover': { bgcolor: 'action.hover' },
};

const thumbSx = {
    width: 48,
    height: 72,
    bgcolor: 'grey.100',
    borderRadius: 0.5,
    overflow: 'hidden',
    flex: '0 0 auto',
};

const FilmographyList = ({ items = [] }) => {
    if (!items || items.length === 0) return <Typography>No credits available.</Typography>;

    return (
        <Box>
            {items.slice(0, 50).map((m, i) => {
                const title = m.title || m.name || 'Untitled';
                const date = m.release_date || m.first_air_date || '—';
                const role = m.character || m.job || '';
                const to = `/movies/${m.id}`;

                return (
                    <React.Fragment key={m.credit_id || `${m.id}-${i}`}>
                        <Box component={Link} to={to} sx={rowSx}>
                            <Box sx={thumbSx}>
                                {m.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200/${m.poster_path}`}
                                        alt={title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : null}
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                                    {title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {date} • {role}
                                </Typography>
                            </Box>
                        </Box>

                        {i < Math.min(items.length, 50) - 1 && <Divider sx={{ my: 0.5 }} />}
                    </React.Fragment>
                );
            })}
        </Box>
    );
};

export default FilmographyList;
