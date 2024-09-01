import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button,
  Box
} from '@mui/material';
import { toast } from 'react-toastify';

const BookingList = () => {
  const [open, setOpen] = useState(false);
  const [bookings, setbookings] = useState([]);
  const [selectedBooking, setselectedBooking] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const openUpdateForm = (booking) => {
    setselectedBooking(booking);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setselectedBooking(null);
    setIsUpdateFormOpen(false);
  };

  useEffect(() => {
    fetchbookings();
  }, [open]);

  const fetchbookings = async () => {
    try {
      const response = await axios.get('https://cinema-trails.onrender.com/api/v1/bookings/getAllBookings');
      setbookings(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`https://cinema-trails.onrender.com/api/v1/bookings/deleteBookingUser/${bookingId}`);
      toast.warning("Booking deleted sucessfully")
      fetchbookings();
    } catch (error) {
        toast.error("Eroor deleting booking")
      console.error('Error deleting booking:', error);
    }
  };
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  return (
    <div className='mb-44'>
      <div className='mb-5'>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>Booking Id</TableCell> */}
              <TableCell>Movie</TableCell>
              <TableCell>Theatre</TableCell>
              <TableCell>Show Date</TableCell>
              <TableCell>Show time</TableCell>


              <TableCell>User name</TableCell>
              <TableCell>Total Tickets</TableCell>
              <TableCell>Total Price</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                {/* <TableCell>{booking?._id}</TableCell> */}

                <TableCell>{booking?.movie?.title}</TableCell>
                <TableCell>{booking?.theatre?.name}</TableCell>

                <TableCell>{formatDate(booking?.showtime?.startDate)}</TableCell>
                <TableCell>{booking?.showtime?.time}</TableCell>

                <TableCell>{booking?.user?.name}</TableCell>
                <TableCell>{booking?.totalTickets}</TableCell>
                <TableCell>Rs {booking?.totalPrice}</TableCell>
                {/* <TableCell>{booking?.description.slice(0, 60) + "..."}</TableCell> */}
                <TableCell>
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
                  <Button onClick={() => handleDelete(booking._id)}>Delete Booking</Button>
      </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
};

export default BookingList;

