import React, { useState } from 'react';
import { format, addDays, subDays, differenceInDays } from 'date-fns';
import { useDate } from '../../DateContext';

const DateScroller = ({ onDateChange }) => {
  const { selectedDate, setSelectedDate } = useDate();
  const initialStartDate = new Date(); // The fixed start date
  const [startDate, setStartDate] = useState(initialStartDate);
  // const [selectedDate, setSelectedDate] = useState({
  //   day: 'THUR',
  //   date: '29 AUG',
  //   fullDate: initialStartDate, // Added to keep track of the full date
  // });

  const maxDays = 10; // Total number of days (start date + 10 days)
  const endDate = addDays(initialStartDate, maxDays - 1); // Calculate the end date

  const generateDates = (start) => {
    const datesArray = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(start, i);
      datesArray.push({
        day: format(date, 'EEE').toUpperCase(),
        date: format(date, 'dd MMM').toUpperCase(),
        fullDate: date, // Full date object
      });
    }
    return datesArray;
  };

  const dates = generateDates(startDate);

  const handleDateChange = (day, date, fullDate) => {
    setSelectedDate({ day, date, fullDate });
    onDateChange(fullDate); // Pass the full date to the parent component
  };

  const handleScrollLeft = () => {
    if (differenceInDays(startDate, initialStartDate) > 0) {
      setStartDate((prevStart) => subDays(prevStart, 7));
      setSelectedDate({
        day: format(subDays(startDate, 7), 'EEE').toUpperCase(),
        date: format(subDays(startDate, 7), 'dd MMM').toUpperCase(),
        fullDate: subDays(startDate, 7),
      });
      onDateChange(subDays(startDate, 7));
    }
  };

  const handleScrollRight = () => {
    if (differenceInDays(endDate, startDate) > 6) {
      setStartDate((prevStart) => addDays(prevStart, 7));
      setSelectedDate({
        day: format(addDays(startDate, 7), 'EEE').toUpperCase(),
        date: format(addDays(startDate, 7), 'dd MMM').toUpperCase(),
        fullDate: addDays(startDate, 7),
      });
      onDateChange(addDays(startDate, 7));
    }
  };

  const isLeftButtonDisabled = differenceInDays(startDate, initialStartDate) <= 0;
  const isRightButtonDisabled = differenceInDays(endDate, startDate) <= 6;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="mb-4 text-center">
        <div className="text-lg font-bold text-black dark:text-white ">{selectedDate.day}</div>
        <div className="text-xl text-red-500 font-bold">{selectedDate.date}</div>
      </div>

      <button
        onClick={handleScrollLeft}
        className={`dark:text-gray-400 text-gray-900 focus:outline-none rotate-90 mb-2 ${isLeftButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLeftButtonDisabled}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex flex-col">
        {dates.map(({ day, date, fullDate }) => (
          <div
            key={date}
            onClick={() => handleDateChange(day, date, fullDate)}
            className={`cursor-pointer flex flex-col items-center px-4 py-2 rounded ${
              selectedDate.date === date ? 'bg-red-500 text-white' : 'text-gray-600'
            }`}
          >
            <span className="font-bold">{day}</span>
            <span className="text-sm">{date}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleScrollRight}
        className={`dark:text-gray-400 text-gray-900 focus:outline-none rotate-90 mt-2 ${isRightButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isRightButtonDisabled}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default DateScroller;
