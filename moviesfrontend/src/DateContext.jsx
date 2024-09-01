import { format } from 'date-fns';
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const DateContext = createContext(); // Export DateContext

// Create a provider component
export const DateProvider = ({ children }) => {
    const initialDate = new Date();
    const [selectedDate, setSelectedDate] = useState({
      day: format(initialDate, 'EEE').toUpperCase(),
      date: format(initialDate, 'dd MMM').toUpperCase(),
      fullDate: initialDate,
    });
  
    return (
      <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
        {children}
      </DateContext.Provider>
    );
  };

// Custom hook to use the DateContext
export const useDate = () => {
  return useContext(DateContext);
};
