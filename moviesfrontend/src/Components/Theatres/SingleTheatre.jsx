import React, { useRef } from 'react';
import ShowTime from './ShowTime';
import gsap from 'gsap';
import { isAfter, isSameDay } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { now } from 'moment';

function SingleTheatre({ theatre, showtimes, selectedDate }) {
  const infoRef = useRef(null);

  // Sort the showtimes in increasing order based on the time
  const sortedShowtimes = [...showtimes].sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}`);
    const timeB = new Date(`1970-01-01T${b.time}`);
    return timeA - timeB;
  });

  // Filter and sort showtimes for the selected date
  const filteredAndSortedShowtimes = sortedShowtimes.filter(show =>
    isSameDay(new Date(show.date), selectedDate)
  );

  return (
    <div className="rounded-xl bg-gray-800 bg-opacity-60 p-4 my-2">
      <div className="flex gap-5 justify-between items-center">
        <h2 className="text-lg font-semibold">{theatre.name}</h2>
        <div
          onMouseEnter={() => {
            gsap.to(infoRef.current, {
              opacity: 1,
              display: "block",
              duration: 0.2,
            });
          }}
          onMouseLeave={() => {
            gsap.to(infoRef.current, {
              opacity: 0,
              display: "none",
              duration: 0.2,
            });
          }}
          className="rounded-full relative border border-gray-600 px-3 py-1 cursor-pointer"
        >
          <div>
            <FontAwesomeIcon icon={faInfo}/>
          </div>
          <div
            ref={infoRef}
            className="absolute hidden rounded-xl bg-gray-800 p-4 z-20 opacity-0 text-nowrap -left-64 -top-4"
          >
            <p>
              <span className="font-semibold">Address: </span>
              {theatre.city}, {theatre.state}, {theatre.country}
            </p>
            <p>
              <span className="font-semibold">Total seats available: </span>
              {theatre.seats}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-5">
        {filteredAndSortedShowtimes.length === 0 ? (
          <p>No showtimes available for the selected date.</p>
        ) : (
          filteredAndSortedShowtimes.map((show, idx) => (
            <ShowTime key={idx} show={show} theatreId={theatre._id}/>
          ))
        )}
      </div>
    </div>
  );
}

export default SingleTheatre;