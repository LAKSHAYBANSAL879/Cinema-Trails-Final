// import React, { useState } from 'react';
// import { format, addDays, subDays, differenceInDays } from 'date-fns';

// const TimeScroller = () => {
//   const initialStartDate = new Date('2024-08-19'); // The fixed start date
//   const [startDate, setStartDate] = useState(initialStartDate);
//   const [selectedDate, setSelectedDate] = useState({
//     day: 'MON',
//     date: '19 AUG',
//   });

//   const maxDays = 10; // Total number of days (start date + 10 days)
//   const endDate = addDays(initialStartDate, maxDays - 1); // Calculate the end date

//   // Generate a list of dates for 7 days starting from the startDate
//   const generateDates = (start) => {
//     const datesArray = [];
//     for (let i = 0; i < 7; i++) {
//       const date = addDays(start, i);
//       datesArray.push({
//         day: format(date, 'EEE').toUpperCase(), // Day of the week
//         date: format(date, 'dd MMM').toUpperCase(), // Date formatted as "dd MMM"
//       });
//     }
//     return datesArray;
//   };

//   const dates = generateDates(startDate);

//   const handleDateChange = (day, date) => {
//     setSelectedDate({ day, date });
//   };

//   const handleScrollLeft = () => {
//     if (differenceInDays(startDate, initialStartDate) > 0) {
//       setStartDate((prevStart) => subDays(prevStart, 7));
//       setSelectedDate({
//         day: format(subDays(startDate, 7), 'EEE').toUpperCase(),
//         date: format(subDays(startDate, 7), 'dd MMM').toUpperCase(),
//       });
//     }
//   };

//   const handleScrollRight = () => {
//     if (differenceInDays(endDate, startDate) > 6) {
//       setStartDate((prevStart) => addDays(prevStart, 7));
//       setSelectedDate({
//         day: format(addDays(startDate, 7), 'EEE').toUpperCase(),
//         date: format(addDays(startDate, 7), 'dd MMM').toUpperCase(),
//       });
//     }
//   };

//   // Disable buttons if at the start or end of the date range
//   const isLeftButtonDisabled = differenceInDays(startDate, initialStartDate) <= 0;
//   const isRightButtonDisabled = differenceInDays(endDate, startDate) <= 6;

//   return (
//     <div className="flex flex-col items-center justify-center py-4">
//       {/* Display the selected date at the top */}
//       <div className="mb-4 text-center">
//         <div className="text-lg font-bold">{selectedDate.day}</div>
//         <div className="text-xl text-red-500 font-bold">{selectedDate.date}</div>
//       </div>

//       {/* Scroll buttons and date list */}
//       <button
//         onClick={handleScrollLeft}
//         className={`text-gray-400 focus:outline-none rotate-90 mb-2 ${isLeftButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//         disabled={isLeftButtonDisabled}
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//       </button>

//       <div className="flex flex-col">
//         {dates.map(({ day, date }) => (
//           <div
//             key={date}
//             onClick={() => handleDateChange(day, date)}
//             className={`cursor-pointer flex flex-col items-center px-4 py-2 rounded ${
//               selectedDate.date === date ? 'bg-red-500 text-white' : 'text-gray-600'
//             }`}
//           >
//             <span className="font-bold">{day}</span>
//             <span className="text-sm">{date}</span>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={handleScrollRight}
//         className={`text-gray-400 focus:outline-none rotate-90 mt-2 ${isRightButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//         disabled={isRightButtonDisabled}
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M9 5l7 7-7 7"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default TimeScroller;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDate } from '../../DateContext';

const TimeScroller = ({ theatreId, movieId }) => {
  const { selectedDate } = useDate();
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const navigate = useNavigate();

  // Fetch showtimes based on the selected date and theater
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        // Use the fullDate property to get the Date object
        const formattedDate = selectedDate.fullDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const response = await axios.get(`https://cinema-trails.onrender.com/api/v1/showTimes/getshowTimeDate/${formattedDate}/theatre/${theatreId}/movie/${movieId}`);
        console.log(response.data);
        setShowtimes(()=>{return response.data});
      } catch (error) {
        console.error('Error fetching showtimes:', error);
      }
    };

    fetchShowtimes();
  }, [selectedDate, theatreId]);

  const handleShowtimeClick = (showtimeId) => {
    setSelectedShowtime(showtimeId);
    navigate(`/seatBooking/${movieId}/${theatreId}/${showtimeId}`);
  };

  return (
    <div className="flex flex-row items-center justify-center py-4">
      <div className="mb-4 text-center">
        <div className="text-lg font-bold">{selectedDate.day}</div>
        <div className="text-xl text-red-500 font-bold">{selectedDate.date}</div>
      </div>
      {showtimes.length > 0 ? (
        showtimes.map((showtime) => (
          <button
            key={showtime._id}
            onClick={() => handleShowtimeClick(showtime._id)}
            className={`cursor-pointer ml-16 flex flex-col items-center px-4 py-2 rounded ${selectedShowtime === showtime._id ? 'bg-red-500 text-white' : 'dark:text-gray-100 text-gray-600'
              }`}
          >
            {showtime.time}
          </button>
        ))
      ) : (
        <div className='text-black dark:text-white'>No showtimes available for this date.</div>
      )}
    </div>
  );
};

export default TimeScroller;
