import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TicketSkeleton from './TicketSkeleton';
import barcode from '../../assets/barcode.png';
import cinemareel from '../../assets/cinemareel.png';
import ticket from '../../assets/ticket1.png';
import movieCollage from '../../assets/movieCollage.jpg';

const Ticket = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`https://cinema-trails.onrender.com/api/v1/bookings/getBooking/${bookingId}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (!bookingDetails) {
    return <TicketSkeleton />;
  }

  const { showtime, theatre, movie, seats, totalTickets, totalPrice, bookedAt } = bookingDetails;
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className='relative h-[34rem] flex justify-center items-center'>
      <div className='-z-10 bg-opacity-10 bg-black dark:bg-opacity-100 w-full h-full fixed top-0'>
        <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
      </div>
      <div className="text-black overflow-hidden w-3/4 max-w-2xl mx-auto p-10 mb-16 relative">
        <img src={ticket} alt='ticket' className='absolute -z-10 -left-0' />
        <div className='h-56 left-2/4 absolute w-0 border border-t-2 border-dashed' style={{ borderColor: "#2B4248" }}></div>
        <div className="relative top-5 text-white">
          <div className='flex justify-between px-3 p-1.5 items-center' style={{ backgroundColor: "#2B4248" }}>
            <p className='text-sm'>Ticket No : {bookingId}</p>
            <p className='font-bold text-xl'>MOVIE TICKET</p>
          </div>
          <div className="rounded-lg p-1 flex justify-between relative overflow-hidden" style={{ color: "#2B4248" }}>
            <div className='flex justify-start gap-3'>
              <div className="w-full">
                <div className="font-bold mb-1">ADMIT {totalTickets}</div>
                <div className='text-xs font-semibold'>
                  <p>Theater: {theatre.name} / Seats: {seats.map(seat => seat.id).join(', ')}</p>
                  <p>Date: {formatDate(showtime.startDate)}</p>
                  <p>Price: Rs{totalPrice}</p>
                </div>
                <div className="mt-2">
                  <img src={barcode} alt="Barcode" className="w-40 h-auto" />
                </div>
              </div>
              <div className="w-1/2 font-bold flex flex-col justify-between">
                <div className='text-xs'>
                  <p>Movie: {movie.title}</p>
                  <p>Theater: {theatre.name}</p>
                  <p>Showtime: {showtime.time}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <p className='text-xs'>Thanks for booking with us!</p>
                  <img src={cinemareel} alt="Cinema Reel" className="h-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
