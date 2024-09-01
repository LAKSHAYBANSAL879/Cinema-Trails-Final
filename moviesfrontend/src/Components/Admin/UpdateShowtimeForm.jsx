import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormGroup,
  Grid
} from '@mui/material'; 
import { toast } from 'react-toastify';

const UpdateShowtimeForm = ({ isOpen, onClose, initialData }) => {
  const [showtime, setShowtime] = useState({
    startDate: '',
    endDate: '',
    movie: '',
    theatre: '',
    ticketPrices: {
      executive: '',
      gold: '',
      silver: ''
    },
    time: '',
    seats: []
  });
console.log(showtime);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    const fetchMoviesAndTheatres = async () => {
      try {
        const moviesResponse = await axios.get('https://cinema-trails.onrender.com/api/v1/movies/getAllMovies');
        setMovies(moviesResponse.data);

        const theatresResponse = await axios.get('https://cinema-trails.onrender.com/api/v1/theaters/getTheaters');
        setTheatres(theatresResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMoviesAndTheatres();
  }, []);

  useEffect(() => {
    if (initialData) {
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; 
          };
      setShowtime({
        startDate: formatDate(initialData.startDate) || '',
        endDate: formatDate(initialData.endDate) || '',
        movie: initialData.movie._id || '',
        theatre: initialData.theatre._id || '',
        ticketPrices: {
          executive: initialData.ticketPrices?.executive || '',
          gold: initialData.ticketPrices?.gold || '',
          silver: initialData.ticketPrices?.silver || ''
        },
        time: initialData.time || '',
        seats: initialData.seats || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setShowtime({ ...showtime, [e.target.name]: e.target.value });
  };

  const handleTicketPriceChange = (e) => {
    setShowtime({
      ...showtime,
      ticketPrices: {
        ...showtime.ticketPrices,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://cinema-trails.onrender.com/api/v1/showTimes/updateshowTime/${initialData._id}`, showtime);
      toast.success("Showtime updated successfully");
      onClose();
    } catch (error) {
      console.error('Error updating showtime:', error);
      toast.error("Error in updating the showtime");
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 transition-all duration-150 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-auto p-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Update Showtime</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={showtime.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={showtime.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Time"
            name="time"
            type="time"
            value={showtime.time}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <FormControl fullWidth required>
            <InputLabel id="movie-select-label">Select Movie</InputLabel>
            <Select
              labelId="movie-select-label"
              name="movie"
              value={showtime.movie}
              onChange={handleChange}
            >
              {movies.map((movie) => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel id="theatre-select-label">Select Theatre</InputLabel>
            <Select
              labelId="theatre-select-label"
              name="theatre"
              value={showtime.theatre}
              onChange={handleChange}
            >
              {theatres.map((theatre) => (
                <MenuItem key={theatre._id} value={theatre._id}>
                  {theatre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Executive Price"
                  name="executive"
                  type="number"
                  value={showtime.ticketPrices.executive}
                  onChange={handleTicketPriceChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Gold Price"
                  name="gold"
                  type="number"
                  value={showtime.ticketPrices.gold}
                  onChange={handleTicketPriceChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Silver Price"
                  name="silver"
                  type="number"
                  value={showtime.ticketPrices.silver}
                  onChange={handleTicketPriceChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </FormGroup>
        </div>

        <div className="flex justify-end mt-4 border-t pt-4">
          <Button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300">
            Cancel
          </Button>
          <Button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateShowtimeForm;
