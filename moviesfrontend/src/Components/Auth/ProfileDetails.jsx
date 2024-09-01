import React, { useContext, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import poster1 from '../../assets/poster1.png';
import { UserContext } from '../../UserContext';
import { faPhone, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import movieCollage from '../../assets/movieCollage.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

function ProfileDetails() {
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

    // const handleCancelBooking = async (bookingId) => {
    //     try {
    //         await axios.delete(`https://cinema-trails.onrender.com/api/v1/bookings/deleteBookingUser/${bookingId}`);
    //         setOrders(orders.filter(order => order._id !== bookingId));
    //     } catch (error) {
    //         console.error('Error canceling booking:', error);
    //     }
    // };
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
        <div className="relative flex flex-col w-full mx-auto dark:text-white text-black min-w-0 mb-6 break-words bg-clip-border bg-light/30 draggable">
            <div className='-z-10 bg-opacity-10 bg-black dark:bg-opacity-90 w-full h-full fixed top-0'>
                <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
            </div>
            <div className="px-4 md:px-9 pt-9 w-full md:w-10/12 mx-auto flex-auto min-h-[70px] pb-0 bg-transparent">
                <div className="flex flex-wrap mb-6 xl:flex-nowrap">
                    <div className="mb-5 mr-5 min-w-fit">
                        <motion.div whileHover={{ scale: 1.2 }} className="relative inline-block shrink-0 rounded-2xl">
                            <img className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px]" src={`https://cinema-trails.onrender.com/api/v1/auth/uploadss/${user?.profileImageUrl}`} alt="Profile" />
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mb-2 w-full">
                        <div className="flex flex-col">
                            <div className="flex items-center mb-2">
                                <a className="text-secondary-inverse hover:text-primary transition-colors duration-200 ease-in-out font-semibold text-[1.5rem] mr-1" href="/">
                                    {user?.name || "Alec Johnson"}
                                </a>
                            </div>
                            <div className="flex flex-wrap pr-2 mb-4 font-medium flex-col justify-center h-full">
                                <div className='flex flex-col md:flex-row'>
                                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary">
                                        <span className="mr-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                        </span> {user?.city} {user?.state} {user?.country}
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary">
                                        <span className="mr-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                            </svg>
                                        </span> {user?.email || "contact@example.com"}
                                    </motion.div>
                                </div>
                                <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-5'>
                                    <motion.div whileHover={{ scale: 1.05 }} className="pt-1 dark:text-white text-black">
                                        <FontAwesomeIcon icon={faPhone} />
                                        <span className='ml-2'>{user?.phone || "9884654325"}</span>
                                    </motion.div>
                                    <motion.p whileHover={{ scale: 1.05 }} className="text-base dark:text-white text-black flex items-center justify-center lg:justify-start">
                                        <svg className="h-4 fill-current dark:text-white text-black pr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
                                        </svg>{user?.role}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end justify-between h-full flex-wrap my-auto">
                            <Link to='/profileEdit'>
                                <motion.div whileHover={{ scale: 1.1 }} className="w-fit inline-block bg-blue-600 hover:bg-blue-700 px-3 text-white py-2 text-sm font-medium leading-normal text-center align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-full text-muted bg-light border-light hover:bg-light-dark active:bg-light-dark focus:bg-light-dark">
                                    <FontAwesomeIcon icon={faPenSquare} />
                                </motion.div>
                            </Link>
                            <motion.div whileHover={{ scale: 1.1 }} className="inline-block bg-red-500 hover:bg-red-600 px-6 py-3 text-sm font-medium leading-normal text-center align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl text-muted bg-light border-light hover:bg-light-dark active:bg-light-dark focus:bg-light-dark"> Delete profile </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative flex flex-col bg-white dark:bg-black bg-opacity-50 min-w-0 pb-6 break-words bg-clip-border rounded-t-2xl bg-light/30 draggable">
            <div className="px-4 md:px-9 w-full mx-auto flex-auto min-h-[70px] pb-0 bg-transparent">
                <ul className="group w-full md:w-10/12 mx-auto flex gap-5 flex-wrap items-stretch text-black dark:text-white text-[1.15rem] font-semibold list-none border-transparent border-solid active-assignments">
                    <li className={`flex mt-2 border-b-2 ${activeTab === 'active' ? 'border-red-500' : 'border-transparent'}`} onClick={() => setActiveTab('active')}>
                        <div className="py-5 mr-1 transition-colors duration-200 ease-in-out text-muted hover:border-primary"> Active bookings </div>
                    </li>
                    <li className={`flex mt-2 ${activeTab === 'history' ? 'border-red-500' : 'border-transparent'}`} onClick={() => setActiveTab('history')}>
                        <div className="py-5 mr-1 transition-colors duration-200 ease-in-out text-muted hover:border-primary"> Booking history </div>
                    </li>
                </ul>
                <hr className="w-full border-1 dark:border-neutral-800 border-neutral-300" />
            </div>
            <div className="p-4 md:p-6 w-full md:w-10/12 mx-auto">
                <div className="space-y-6 bg-white dark:bg-gray-900 p-4 md:p-8 rounded-xl">
                    {orders.map((order) => (
                        <motion.div whileHover={{ scale: 1.05 }} key={order._id} className="mx-2 md:mx-5">
                            <div className='flex flex-col md:flex-row justify-between gap-5'>
                                <div className='w-full'>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                                        <div>
                                            <h3 className="text-xl md:text-2xl text-black dark:text-white font-medium mb-2">{order.movie.title}</h3>
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
                                                    <span className="font-medium">Seats:</span> {order.seats.map(seat => seat.id).join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right flex flex-col justify-between gap-2 mt-2 md:mt-0">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Ticket ID: {order._id}</p>
                                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">Rs {order.totalPrice}</p>
                                            </div>
                                            {activeTab === 'active' && (
                                                <motion.div 
                                                    whileHover={{ scale: 1.1 }} 
                                                    className="inline-block bg-red-500 hover:bg-red-600 px-3 py-1.5 text-xs md:text-sm font-medium leading-normal text-center align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl text-white w-fit"
                                                    onClick={() => handleCancelBooking(order._id)}
                                                >
                                                    Cancel Reservation
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full md:w-1/2'>
                                    <img src={order.movie?.images[1]} className='rounded-xl h-40 w-full object-cover' alt='movie poster' />
                                </div>
                            </div>
                            <hr className='my-5 dark:border-neutral-600 border-neutral-300' />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
}

export default ProfileDetails;
