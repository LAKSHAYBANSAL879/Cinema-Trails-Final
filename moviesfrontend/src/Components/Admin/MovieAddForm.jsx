import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button
} from '@mui/material'; // Updated import
import { Link, Navigate, useNavigate } from 'react-router-dom';

const MovieAddForm = ({ isopen, onClose }) => {
  const formatDateToInputValue = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [currentMovie, setCurrentMovie] = useState({
    title: '',
    images: '',
    language: '',
    genre: '',
    director: '',
    trailer: '',
    description: '',
    duration: '',
    startDate: formatDateToInputValue(),
    endDate: formatDateToInputValue(),
    rating: 0,
    cast: ''
  });
  const handleChange = (e) => {
    setCurrentMovie({ ...currentMovie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split comma-separated fields into arrays
    const movieData = {
      ...currentMovie,
      images: currentMovie.images.split(',').map((img) => img.trim()),
      genre: currentMovie.genre.split(',').map((g) => g.trim()),
      cast: currentMovie.cast.split(',').map((c) => c.trim()),
    };
    try {
      // if (currentMovie._id) {
      //   await axios.put(`/api/admin/movies/${currentMovie._id}`, currentMovie);
      // } else {
      console.log(movieData);
      await axios.post('https://cinema-trails.onrender.com/api/v1/movies/addMovie', movieData);
      // }
      
      onClose();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  const handleDateChange = (name, date) => {
    setCurrentMovie({ ...currentMovie, [name]: date });
  };

  return (
    <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 items-center justify-center z-50 transition-all duration-150 overflow-y-auto max-h-screen`}>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-auto p-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Add/Edit Movie</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="title"
              value={currentMovie.title}
              onChange={handleChange}
              placeholder="Title"
              className="p-2 border border-gray-300 rounded-md w-full"
              required
            />
            <input
              type="text"
              name="images"
              value={currentMovie.images}
              onChange={handleChange}
              placeholder="Images (Comma Separated URLs)"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="language"
                value={currentMovie.language}
                onChange={handleChange}
                placeholder="Language"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="genre"
                value={currentMovie.genre}
                onChange={handleChange}
                placeholder="Genre (Comma Separated)"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="director"
                value={currentMovie.director}
                onChange={handleChange}
                placeholder="Director"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="trailer"
                value={currentMovie.trailer}
                onChange={handleChange}
                placeholder="Trailer URL"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <textarea
              name="description"
              value={currentMovie.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-2 border border-gray-300 rounded-md w-full"
              rows="4"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="duration"
                value={currentMovie.duration}
                onChange={handleChange}
                placeholder="Duration (Minutes)"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
              <input
                type="number"
                name="rating"
                value={currentMovie.rating}
                onChange={handleChange}
                placeholder="Ratings"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor='startDate'>Start date</label>
                <input
                  type="date"
                  name="startDate"
                  value={currentMovie.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  placeholder="Start Date"
                  className="p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor='endDate'>End date</label>
                <input
                  type="date"
                  name="endDate"
                  value={currentMovie.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  placeholder="End Date"
                  className="p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
            </div>
            <input
              type="text"
              name="cast"
              value={currentMovie.cast}
              onChange={handleChange}
              placeholder="Cast (Comma Separated)"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
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

export default MovieAddForm;