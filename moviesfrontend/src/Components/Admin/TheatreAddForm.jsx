import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText
} from '@mui/material'; // MUI components
import { toast } from 'react-toastify';

const TheatreAddForm = ({ isopen, onClose }) => {
  const [theatre, setTheatre] = useState({
    name: '',
    state: '',
    seats: '',
    city: '',
    country: '',
    images: '',
    movies: []
  });

  const [allMovies, setAllMovies] = useState([]); 
  const [availableMovies, setAvailableMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://cinema-trails.onrender.com/api/v1/movies/getAllMovies');
        setAllMovies(response.data);
       
        setAvailableMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const filteredMovies = allMovies.filter(
      movie => !theatre.movies.includes(movie._id)
    );
    setAvailableMovies(filteredMovies);
  }, [theatre.movies, allMovies]);

  const handleChange = (e) => {
    setTheatre({ ...theatre, [e.target.name]: e.target.value });
  };

  const handleMovieSelect = (e) => {
    const selectedMovieId = e.target.value;
    setTheatre((prevState) => ({
      ...prevState,
      movies: [...prevState.movies, selectedMovieId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const theatreData = {
      ...theatre,
      images: theatre.images.split(',').map((img) => img.trim())
    };
    try {
      await axios.post('https://cinema-trails.onrender.com/api/v1/theaters/addTheater', theatreData);
      toast.success("New theatre added sucessfully");
      onClose();
    } catch (error) {
      console.error('Error saving theatre:', error);
      toast.error("Eroor in adding a new theatre");

    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 transition-all duration-150 overflow-y-auto `}>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-auto p-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Add/Edit Theatre</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <TextField
            label="Name"
            name="name"
            value={theatre.name}
            onChange={handleChange}
            fullWidth
            required
          />
          
          <TextField
            label="Seats"
            name="seats"
            value={theatre.seats}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="City"
            name="city"
            value={theatre.city}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="State"
            name="state"
            value={theatre.state}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Country"
            name="country"
            value={theatre.country}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Images (Comma Separated URLs)"
            name="images"
            value={theatre.images}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="movie-select-label">Add Movie</InputLabel>
            <Select
              labelId="movie-select-label"
              value=""
              onChange={handleMovieSelect}
            >
              {availableMovies.map(movie => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <List>
            {theatre.movies.map(movieId => {
              const movie = allMovies.find(m => m._id === movieId);
              return (
                <ListItem key={movieId}>
                  <ListItemText primary={movie ? movie.title : "Unknown Movie"} />
                </ListItem>
              );
            })}
          </List>
        </div>

        <div className="flex justify-end mt-4 border-t pt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300">
            Cancel
          </button>
          <button type='submit' className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TheatreAddForm;
