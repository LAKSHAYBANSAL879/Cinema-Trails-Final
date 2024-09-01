import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import movieCollage from '../../assets/movieCollage.jpg';
import { motion } from "framer-motion";
import SingleTheatre from './SingleTheatre';
import DateScroller from './DateScroller';
import AddReview from '../Movies/AddReview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ShowListing() {
    const [showAddReview, setShowAddReview] = useState(false);
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [filteredTheaters, setFilteredTheaters] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const navigate = useNavigate();
    const dataRef = useRef(null);
    const { movieId } = useParams();

    const monthsArray = {
        0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr',
        4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug',
        8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'
    };
    const [selectedDate, setSelectedDate] = useState(new Date('2024-08-29'));
    const [isLoading, setIsLoading] = useState(true);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`https://cinema-trails.onrender.com/api/v1/movies/getMovieDetails/${movieId}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        const fetchTheatersAndShowtimes = async () => {
            try {
                const response = await axios.get(`https://cinema-trails.onrender.com/api/v1/movies/getAllTheatersShowtimes/${movieId}`);
                setTheaters(response.data);
                setFilteredTheaters(response.data);
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching theaters and showtimes:', error.response ? error.response.data : error.message);
            }
        };

        fetchMovieDetails();
        fetchTheatersAndShowtimes();
    }, [movieId]);

    useEffect(() => {
        const filtered = theaters.filter(theater => 
            (selectedState === '' || theater.theatre.state === selectedState) &&
            (selectedCity === '' || theater.theatre.city === selectedCity)
        );
        setFilteredTheaters(filtered);
    }, [selectedState, selectedCity, theaters]);

    const handleShowtimeClick = (theaterId, showtimeId) => {
        navigate(`/seat-selection/${movieId}/${theaterId}/${showtimeId}`);
    };

    const handleAddReviewSuccess = (newReview) => {
        setMovie((prevData) => ({
            ...prevData,
            reviews: [...prevData.reviews, newReview],
        }));
    };

    return (
        <>
            <div className='relative w-full h-[37rem] mt-5 text-white'>
                {showAddReview && (
                    <div className='absolute left-1/2 -top-10 z-30 w-full'>
                        <AddReview onAddReviewSuccess={handleAddReviewSuccess} setShowAddReview={setShowAddReview} />
                    </div>
                )}
                <div className='-z-10 bg-opacity-10 bg-black dark:bg-opacity-100 w-full h-full fixed top-0'>
                    <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
                </div>
                <div className='flex w-full items-center h-[37rem] justify-evenly'>
                    <div className='w-2/3 flex items-center justify-around'>
                        <div>
                            <DateScroller onDateChange={handleDateChange} />
                        </div>
                        <div className='w-5/6'>
                            <div className='mb-5 flex justify-between'>
                                <span className='text-3xl font-semibold text-black dark:text-white'>
                                    {isLoading ? <Skeleton width={200} /> : 'Show Listings'}
                                </span>
                                <div className='flex gap-2'>
                                    <form className="max-w-sm mx-auto">
                                        <select 
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={selectedState}
                                            onChange={(e) => setSelectedState(e.target.value)}
                                        >
                                            <option value="">Choose state</option>
                                            <option value="Haryana">Haryana</option>
                                            <option value="DELHI">Delhi</option>
                                            <option value="Uttar pradesh">Uttar Pradesh</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                        </select>
                                    </form>
                                    <form className="max-w-sm mx-auto">
                                        <select 
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                        >
                                            <option value="">Choose city</option>
                                            <option value="Fariabad">Faridabad</option>
                                            <option value="Gurgaon">Gurgaon</option>
                                            <option value="NEW DELHI">New Delhi</option>
                                            <option value="Noida">Noida</option>
                                        </select>
                                    </form>
                                </div>
                            </div>
                            <div className='h-[30rem] overflow-auto'>
                                {isLoading ? (
                                    <Skeleton count={5} height={120} />
                                ) : filteredTheaters.length === 0 ? (
                                    <p className='text-black dark:text-white'>No theaters found for this movie in the selected location.</p>
                                ) : (
                                    filteredTheaters.map((theater, index) => (
                                        <SingleTheatre 
                                            key={index} 
                                            theatre={theater.theatre} 
                                            showtimes={theater.showtimes} 
                                            selectedDate={selectedDate}
                                            onShowtimeClick={handleShowtimeClick}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='w-1/4 relative top-0'>
                        {isLoading ? (
                            <Skeleton height={400} />
                        ) : (
                            movie && (
                                <div>
                                    <div ref={dataRef} className="bg-transparent dark:text-white text-black p-6 rounded-lg max-w-2xl relative mb-5">
                                        <div className='flex gap-2'>
                                            {movie.genre.map((value, index) => (
                                                <span key={index} className="bg-gray-800 text-white rounded-xl px-3 py-1 text-sm">{value}</span>
                                            ))}
                                        </div>
                                        <h2 className="text-2xl font-bold my-8">{movie.title}</h2>
                                        <p className="text-gray-400 mt-4">
                                            {`${Math.floor(movie.duration / 60)}h ${Math.floor(movie.duration % 60)}m} • ${new Date(movie.startDate).getDate()} ${monthsArray[new Date(movie.startDate).getMonth()]} ${new Date(movie.startDate).getFullYear()}`} • {movie.language}
                                        </p>
                                        <p className="dark:text-gray-400 text-gray-800 mt-1">
                                            {movie.description}
                                        </p>
                                        <div className="flex items-center bg-gray-800 text-white rounded-lg px-4 w-fit my-4 py-2">
                                            <div className="flex items-center">
                                                <span className="text-pink-500">⭐</span>
                                                <span className="ml-2 font-semibold text-lg">{Math.round(movie.rating)}/10</span>
                                                <span className="ml-2 text-gray-400">
                                                    {movie.reviews.length === 1 ? `(${movie.reviews.length} vote)` : `(${movie.reviews.length} votes)`}
                                                </span>
                                            </div>
                                            <button className="ml-4 bg-white text-black font-semibold px-4 py-1 rounded-lg" onClick={() => { setShowAddReview(true) }}>Rate now</button>
                                        </div>
                                        <div className='flex flex-col mr-5 mb-5 items-end'>
                                    <a href={movie.trailer} className="flex items-center justify-center w-24 h-24 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-75 transition duration-300 ease-in-out cursor-pointer">
                                        <motion.div whileHover={{ scale: 2 }} className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-25 rounded-full">
                                            <FontAwesomeIcon icon={faPlay}/>
                                        </motion.div>
                                    </a>
                                    <div className="text-white text-sm font-medium mt-2">
                                        Watch Trailer
                                    </div>
                                </div>
                                    </div>
                                </div>
                            )
                        )}
                        <div>
                            <img src={movie?.images[0]} alt='poster1' className='rounded-xl absolute top-0 h-full left-0 opacity-45 -z-10' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShowListing;
