import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieAddForm from './MovieAddForm';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import UpdateMovieForm from './UpdateMovieForm';

const MoviesTicket = () => {
  const [open, setOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const openUpdateForm = (movie) => {
    setSelectedMovie(movie);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setSelectedMovie(null);
    setIsUpdateFormOpen(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [open]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('https://cinema-trails.onrender.com/api/v1/movies/getAllMovies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://cinema-trails.onrender.com/api/v1/movies/deleteMovie/${id}`);
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className='mb-44'>
      <div className='mb-5'>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Movie
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie._id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.description.slice(0, 60) + "..."}</TableCell>
                <TableCell>
                  {`${Math.floor(movie.duration / 60)}h ${Math.floor(movie.duration % 60)}m`}
                </TableCell>
                <TableCell>
                <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }, 
      gap: 1, 
      alignItems: 'center',
    }}
  >
                  <Button onClick={() => handleDelete(movie._id)}>Delete</Button>
                  <Button>
                    <Link to={`/movie/showListing/${movie._id}`}>Show Listings</Link>
                  </Button>
                  <Button variant="contained" onClick={() => openUpdateForm(movie)}>Update Movie</Button>
      {isUpdateFormOpen && (
        <UpdateMovieForm movie={selectedMovie} isOpen={isUpdateFormOpen} onClose={closeUpdateForm} />
      )}
      </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <MovieAddForm
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default MoviesTicket;
