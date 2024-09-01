import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../UserContext';
import axios from 'axios';
import moment from 'moment';
import movieCollage from '../../assets/movieCollage.jpg';
import { motion } from "framer-motion"

const Reservations = () => {
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('active');
    const [orders, setOrders] = useState([]);
    const userId = user?._id;


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`https://cinema-trails.onrender.com/api/v1/bookings/userBookings/${userId}`);
                const bookings = response.data;
                console.log("All bookings of a given user is", bookings)
                console.log(bookings[0].showtime.startDate)
                // Separate bookings into active and history
                const today = moment().startOf('day');
                const activeBookings = bookings.filter(order =>
                    order.showtime && order.showtime.startDate && moment(order.showtime.startDate).isAfter(today)
                );
                const historyBookings = bookings.filter(order =>
                    order.showtime && order.showtime.startDate && moment(order.showtime.startDate).isBefore(today)
                );

                setOrders(activeTab === 'active' ? activeBookings : historyBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [activeTab, user]);

    const handleCancelBooking = async (bookingId) => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this booking?");

        if (isConfirmed) {
            try {
                await axios.delete(`https://cinema-trails.onrender.com/api/v1/bookings/deleteBookingUser/${bookingId}`);
                setOrders(orders.filter(order => order._id !== bookingId));
                alert("Booking canceled successfully.");
            } catch (error) {
                console.error('Error canceling booking:', error);
                alert("Cancellation failed. Please try again later.");
            }
        }
    };
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };
    return (
        <div>
            <div className="relative flex flex-col   min-w-0 pb-6 break-words  bg-clip-border rounded-t-2xl  bg-light/30 draggable">
                <div className='-z-10  bg-opacity-10 bg-black dark:bg-opacity-100  w-full h-full fixed top-0'>
                    <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
                </div>
                <div className="px-9 w-full mx-auto flex-auto min-h-[70px] pb-0 bg-transparent">
                    <ul className="group w-10/12 mx-auto flex gap-5 flex-wrap items-stretch text-black dark:text-white text-[1.15rem] font-semibold list-none border-transparent border-solid active-assignments">
                        <li className={`flex mt-2 border-b-2 ${activeTab === 'active' ? 'border-red-500' : 'border-transparent'}`} onClick={() => setActiveTab('active')}>
                            <div className="py-5 mr-1 transition-colors duration-200 ease-in-out text-muted hover:border-primary"> Active bookings </div>
                        </li>
                        <li className={`flex mt-2 ${activeTab === 'history' ? 'border-red-500' : 'border-transparent'}`} onClick={() => setActiveTab('history')}>
                            <div className="py-5 mr-1 transition-colors duration-200 ease-in-out text-muted hover:border-primary"> Booking history </div>
                        </li>
                    </ul>
                    <hr className="w-full border-1 dark:border-neutral-800 border-neutral-300" />
                </div>
                <div className="p-6 w-10/12 mx-auto">
                    <div className="space-y-6  bg-white dark:bg-gray-900 dark:bg-opacity-60 bg-opacity-70  p-8 rounded-xl">
                        {orders.map((order) => (
                            <motion.div whileHover={{ scale: 1.05 }} key={order.id} className="mx-5">
                                <div className='flex justify-between gap-5'>
                                    <div className='w-full'>
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h3 className="text-2xl text-black dark:text-white  font-medium mb-2">{order.movie.title}</h3>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-medium">Theatre:</span> {order.theatre.name}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Date:</span> {formatDate(order.showtime.startDate)}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Time:</span> {order.showtime.time}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Seats:</span>
                                                        {order.seats.map(seat => seat.id).join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right  flex flex-col justify-between gap-2">
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Ticket ID: {order._id}</p>
                                                    <p className="text-lg font-semibold  text-blue-600 dark:text-blue-400">Rs {order.totalPrice}</p>
                                                </div>
                                                {activeTab === 'active' && (
                                                    <motion.div whileHover={{ scale: 1.1 }} className="inline-block bg-red-500 hover:bg-red-600 px-3 py-1.5 text-sm font-medium leading-normal text-center align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl text-muted bg-light border-light hover:bg-light-dark active:bg-light-dark focus:bg-light-dark" onClick={() => handleCancelBooking(order._id)}> Cancel reservation </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-1/2 '>
                                        <img src={order.movie?.images[1]} className='rounded-xl h-40 w-full' alt='movie poster' />
                                    </div>
                                </div>
                                <hr className='my-5 dark:border-neutral-600 border-neutral-300' />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reservations