import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button
} from '@mui/material';
import { toast } from 'react-toastify';
import UpdateshowtimeForm from './UpdateShowtimeForm.jsx';
import ShowtimeAddForm from './ShowtimeAddForm.jsx';

const ShowTimeList = () => {
  const [open, setOpen] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const openUpdateForm = (showtime) => {
    setSelectedShowtime(showtime);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setSelectedShowtime(null);
    setIsUpdateFormOpen(false);
  };

  useEffect(() => {
    fetchShowtimes();
  }, [open]);

  const fetchShowtimes = async () => {
    try {
      const response = await axios.get('https://cinema-trails.onrender.com/api/v1/showTimes/getAllShows');
      setShowtimes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://cinema-trails.onrender.com/api/v1/showTimes/deleteshowTime/${id}`);
      toast.warning("Showtime deleted successfully");
      fetchShowtimes();
    } catch (error) {
      console.error('Error deleting showtime:', error);
      toast.error("Error deleting showtime");
    }
  };

  const sortedShowtimes = showtimes.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className='mb-44'>
      <div className='mb-5'>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Showtime
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Movie</TableCell>
              <TableCell>Theatre</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Ticket Prices</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedShowtimes.map((showtime) => (
              <TableRow key={showtime._id}>
                <TableCell>{showtime.time}</TableCell>
                <TableCell>{showtime.movie?.title}</TableCell>
                <TableCell>{showtime.theatre?.name}</TableCell>
                <TableCell>
                  {showtime.startDate ? new Date(showtime.startDate).toLocaleDateString() : 'No Date Available'}
                </TableCell>
                <TableCell>
  Executive: {showtime.ticketPrices?.executive},  Gold: {showtime.ticketPrices?.gold}, Silver: {showtime.ticketPrices?.silver}
</TableCell>

                <TableCell>
                  <Button onClick={() => handleDelete(showtime._id)}>Delete</Button>
                  <Button variant="contained" onClick={() => openUpdateForm(showtime)}>Update Showtime</Button>
                  {isUpdateFormOpen && (
                    <UpdateshowtimeForm initialData={selectedShowtime} isOpen={isUpdateFormOpen} onClose={closeUpdateForm} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <ShowtimeAddForm
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default ShowTimeList;
