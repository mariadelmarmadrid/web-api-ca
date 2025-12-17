import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router';

const KnownForCarousel = ({ items = [] }) => {
    if (!items || items.length === 0) return null;

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Known For</Typography>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
                {items.map((k) => (
                    <BoxLink key={k.credit_id} item={k} />
                ))}
            </Box>
        </Box>
    );
};

const BoxLink = ({ item }) => (
    <Box component={Link} to={`/movies/${item.id}`} sx={{ minWidth: 120, textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
        {item.poster_path ? (
            <Card sx={{ borderRadius: 1, overflow: 'hidden' }}>
                <CardMedia component="img" image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item.title || item.name} sx={{ height: 180, objectFit: 'cover' }} />
                <CardContent>
                    <Typography variant="caption" noWrap>{item.title || item.name}</Typography>
                </CardContent>
            </Card>
        ) : (
            <Card sx={{ width: 120, height: 180, bgcolor: 'grey.100' }} />
        )}
    </Box>
);

export default KnownForCarousel;
