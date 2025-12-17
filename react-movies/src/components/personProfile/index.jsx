import React from 'react';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { formatBirthDate } from '../../util';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const PersonProfile = ({ person }) => {
    return (
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center', position: 'sticky', top: 96 }}>
            {person.profile_path ? (
                <Avatar
                    src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                    alt={person.name}
                    sx={{ width: '100%', height: 'auto', maxWidth: 280, mx: 'auto', borderRadius: 2 }}
                    variant="rounded"
                />
            ) : (
                <Avatar sx={{ width: 160, height: 240, mx: 'auto', bgcolor: 'grey.300' }} variant="rounded">{person.name ? person.name.charAt(0) : 'P'}</Avatar>
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`Born: ${formatBirthDate(person.birthday)}`} size="small" />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ textAlign: 'left', fontWeight: 700 }}>Personal Info</Typography>
            <Box sx={{ textAlign: 'left', mt: 1 }}>
                <List dense disablePadding>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primary="Known For" secondary={person.known_for_department || '—'} />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primary="Gender" secondary={person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : '—'} />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primary="Place of Birth" secondary={person.place_of_birth || '—'} />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primary="Also Known As" secondary={(person.also_known_as && person.also_known_as.slice(0,3).join(', ')) || '—'} />
                    </ListItem>
                </List>
            </Box>
        </Paper>
    );
};

export default PersonProfile;
