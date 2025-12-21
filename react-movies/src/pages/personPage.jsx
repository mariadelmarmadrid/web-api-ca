/**
 * Person Page
 * Displays profile, details and filmography for an actor/crew member
 * - Fetches person details (`getPerson`) and movie credits (`getPersonMovieCredits`)
 * - Provides filters for departments and a sorted filmography
 */
import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getPerson, getPersonMovieCredits } from '../api/tmdb-api';
import Spinner from '../components/spinner';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MoviesContext } from '../contexts/moviesContextValue';
import PersonProfile from '../components/personProfile';
import PersonDetails from '../components/personDetails';

const PersonPage = () => {
  const { id } = useParams();
  const { language } = useContext(MoviesContext);

  const {
    data: person,
    error: personError,
    isPending: personLoading,
    isError: personIsError
  } = useQuery({
    queryKey: ['person', { id, language }],
    queryFn: getPerson,
  });

  const {
    data: credits,
    error: creditsError,
    isPending: creditsLoading,
    isError: creditsIsError
  } = useQuery({
    queryKey: ['personCredits', { id, language }],
    queryFn: getPersonMovieCredits,
  });


  const filmography = useMemo(() => {
    if (!credits || !credits.cast) return [];
    return [...credits.cast].sort(
      (a, b) => (b.release_date || '').localeCompare(a.release_date || '')
    );
  }, [credits]);

  const [deptFilter, setDeptFilter] = useState('All');

  const departments = useMemo(() => {
    const set = new Set();
    if (credits?.cast?.length) set.add('Acting');
    if (credits?.crew) credits.crew.forEach(c => set.add(c.department || 'Crew'));
    return ['All', ...Array.from(set)];
  }, [credits]);

  const filteredFilmography = useMemo(() => {
    if (deptFilter === 'All' || deptFilter === 'Acting') return filmography;
    return filmography.filter(
      m => (m.department || '').toLowerCase() === deptFilter.toLowerCase()
    );
  }, [filmography, deptFilter]);

  const knownFor = useMemo(() => {
    if (!credits) return [];
    const items = [...(credits.cast || [])];
    items.sort(
      (a, b) => (b.popularity || b.vote_count || 0) - (a.popularity || a.vote_count || 0)
    );
    return items.slice(0, 8);
  }, [credits]);


  if (personLoading || creditsLoading) return <Spinner />;
  if (personIsError) return <h1>{personError.message}</h1>;
  if (creditsIsError) return <h1>{creditsError.message}</h1>;

  
  return (
    <Grid
      container
      wrap="nowrap"            
      columnSpacing={3}
      alignItems="flex-start"
      sx={{ minHeight: '100%', overflow: 'hidden' }}
    >
      {/* Left: fixed width profile */}
      <Grid item sx={{ width: 320, flex: '0 0 320px' }}>
        <PersonProfile person={person} />
      </Grid>

      {/* Right: details fill remaining space */}
      <Grid item sx={{ flex: '1 1 auto', minWidth: 600 }}>
        <PersonDetails
          person={person}
          knownFor={knownFor}
          filmography={filteredFilmography}
          filmographyHeader={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2">Department</Typography>
              <Select
                size="small"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default PersonPage;
