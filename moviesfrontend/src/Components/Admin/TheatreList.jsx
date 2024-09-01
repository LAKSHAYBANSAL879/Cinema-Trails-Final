import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TheatreAddForm from './TheatreAddForm';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import UpdatetheatreForm from './UpdateTheatreForm';
import { toast } from 'react-toastify';

const TheatreList = () => {
  const [open, setOpen] = useState(false);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const openUpdateForm = (theatre) => {
    setSelectedTheatre(theatre);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setSelectedTheatre(null);
    setIsUpdateFormOpen(false);
  };

  useEffect(() => {
    fetchTheatres();
  }, [open]);

  const fetchTheatres = async () => {
    try {
      const response = await axios.get('https://cinema-trails.onrender.com/api/v1/theaters/getTheaters');
      setTheatres(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching theatres:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://cinema-trails.onrender.com/api/v1/theaters/deleteTheater/${id}`);
      toast.warning("Theatre deleted sucessfully")
      fetchTheatres();
    } catch (error) {
      console.error('Error deleting theatre:', error);
      toast.error("Eroor deleting a theatre")
    }
  };

  return (
    <div className='mb-44'>
      <div className='mb-5'>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New theatre
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Movies</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Actions</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {theatres.map((theatre) => (
              <TableRow key={theatre._id}>
                <TableCell>{theatre.name}</TableCell>
                <TableCell> {theatre.movies.map(movie => movie.title).join(', ')}</TableCell>
                <TableCell>
                 {theatre.city}, {theatre.state}, {theatre.country}
                </TableCell>
                <TableCell>{theatre.seats}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(theatre._id)}>Delete</Button>
                  <Button variant="contained" onClick={() => openUpdateForm(theatre)}>Update theatre</Button>
      {isUpdateFormOpen && (
        <UpdatetheatreForm theatreData={selectedTheatre} isOpen={isUpdateFormOpen} onClose={closeUpdateForm} />
      )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <TheatreAddForm
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default TheatreList;
