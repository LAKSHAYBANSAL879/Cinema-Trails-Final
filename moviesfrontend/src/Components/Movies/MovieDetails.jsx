import React, { useState, useEffect } from 'react';
import axios from 'axios';
import movieCollage from '../../assets/movieCollage.jpg';
import AddReview from './AddReview';
import { motion } from "framer-motion";
import { Link, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import  Reviews  from './Reviews';
import Cast from './Cast';
import MovieImages from './MovieImages';

function MovieDetails() {
    const [activeTab, setActiveTab] = useState('Reviews');
    const [showAddReview, setShowAddReview] = useState(false);
    const [data, setData] = useState(null);
    const { movieId } = useParams();
    console.log(movieId);

    const monthsArray = {
        0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr',
        4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug',
        8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'
    };

    const tabs = [
        { name: 'Reviews' },
        { name: 'Cast' },
        { name: 'Movie Posters' }
    ];

    useEffect(() => {
        axios.get(`https://cinema-trails.onrender.com/api/v1/movies/getMovieDetails/${movieId}`)
            .then(response => {
                setData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching movie data:', error);
            });
    }, [movieId]);

    if (!data) {
        return (
            <div className='relative w-full h-[37rem] flex flex-col items-center text-black dark:text-white justify-start transition-all duration-500'>
                <div className='-z-10 bg-opacity-10 bg-black dark:bg-opacity-100 w-full h-full fixed top-0'>
                    <Skeleton height="100%" width="100%" />
                </div>
                <div className='flex w-full h-full items-end justify-around'>
                    <div className="bg-transparent text-black dark:text-white p-6 rounded-lg max-w-2xl relative mb-10">
                        <Skeleton height={40} width={200} />
                        <Skeleton height={30} width={300} />
                        <Skeleton height={20} width={400} />
                        <Skeleton height={20} width={150} />
                        <Skeleton height={20} width={200} />
                        <Skeleton height={50} width={150} />
                    </div>
                    <div className='flex items-end h-full'>
                        <div className='flex flex-col mr-5 mb-5'>
                            <Skeleton circle height={96} width={96} />
                            <Skeleton height={20} width={100} />
                        </div>
                        <div className='w-3/4 h-3/4'>
                            <Skeleton height="100%" width="100%" />
                        </div>
                    </div>
                </div>
                <div className='mt-10 px-20'>
                    <Skeleton height={50} width={200} />
                    <Skeleton height={50} width={1000} />
                </div>
            </div>
        );
    }

    const handleAddReviewSuccess = (newReview) => {
        setData((prevData) => ({
            ...prevData,
            reviews: [...prevData.reviews, newReview],
        }));
    };

    const date = new Date(data.startDate);

    return (
        <>
            <div className='relative w-full h-[33rem] flex flex-col items-center text-black dark:text-white justify-start transition-all duration-500'>
                <div className='-z-10 bg-opacity-10 bg-black dark:bg-opacity-100 w-full h-full fixed top-0'>
                    <img src={movieCollage} className='opacity-10 dark:invert-0 invert' alt='' />
                </div>
                {showAddReview && (
                    <div className='absolute md:left-64 lg:left-96 xl:left-1/2 top-0 z-30 w-full'>
                        <AddReview
                            onAddReviewSuccess={handleAddReviewSuccess}
                            setShowAddReview={setShowAddReview} />
                    </div>
                )}
               
                <div className='flex w-full h-full items-end justify-around'>
                    <div className="bg-transparent text-black dark:text-white p-6 rounded-lg max-w-2xl relative mb-10">
                        <div className='flex gap-2 text-white'>
                            {data.genre.map((value, index) => (
                                <span key={index} className="bg-gray-800 rounded-xl px-3 py-1 text-sm">{value}</span>
                            ))}
                        </div>
                        <h2 className="text-5xl font-bold mt-6">{data.title}</h2>
                        <p className="text-gray-800 dark:text-gray-400 mt-4">
                            {`${Math.floor(data.duration / 60)}h ${Math.floor(data.duration % 60)}m`} • {` ${date.getDate()} ${monthsArray[date.getMonth()]} ${date.getFullYear()} `} • {data.language}
                        </p>
                        <p className="text-gray-800 dark:text-gray-400 mt-1">{data.description}</p>
                        <div className="flex items-center bg-gray-800 text-white rounded-lg px-4 w-fit my-4 py-2">
                            <div className="flex items-center">
                                <span className="text-pink-500">⭐</span>
                                <span className="ml-2 font-semibold text-lg">{Math.round(data.rating) + "/10"}</span>
                                <span className="ml-2 text-gray-400">
                                    {data.reviews.length === 1 ? `(${data.reviews.length} vote)` : `(${data.reviews.length} votes)`}
                                </span>
                            </div>
                            <button className="ml-4 bg-white text-black font-semibold px-4 py-1 rounded-lg" onClick={() => { setShowAddReview(true) }}>Rate now</button>
                        </div>
                        <div className="mt-6 flex items-center space-x-4">
                            <Link to={`/movie/ShowListing/${movieId}`} className="dark:bg-white bg-gray-800 text-white dark:text-black rounded-xl px-6 py-2 font-semibold">Show Listings</Link>
                        </div>
                    </div>

                    <div className='flex items-end h-full'>
                        <div className='flex flex-col mr-5 mb-5'>
                            <a href={data.trailer} className="flex items-center justify-center w-24 h-24 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-75 transition duration-300 ease-in-out cursor-pointer">
                                <motion.div whileHover={{ scale: 2 }} className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-25 rounded-full">
                                    <FontAwesomeIcon icon={faPlay} />
                                </motion.div>
                            </a>
                            <div className="text-center text
                            -black dark:text-white text-sm font-medium mt-2">
                                Watch Trailer
                            </div>
                        </div>
                        <div className='w-3/4 h-3/4'>
                            <img src={data.images[0]} alt='poster1' className='w-full h-full rounded-xl' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-6 px-4 md:px-20'>
        <div className='flex flex-col'>
          <div className="flex flex-wrap justify-center dark:bg-black backdrop-blur-sm pb-2 px-2 md:px-6 sticky top-0 py-3 md:py-5 mb-8 md:mb-16">
            {tabs.map((tab, index) => (
              <a
                key={index}
                href={"#" + tab.name.replace(" ", "")}
                className={`cursor-pointer py-2 px-2 md:px-4 text-sm md:text-base
                ${activeTab === tab.name ? 'border-b-4 font-semibold border-blue-500 dark:text-white text-black' : 'dark:text-gray-200 text-gray-800 font-medium'}
                dark:hover:text-gray-400 hover:text-gray-900 transition-colors duration-300`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
              </a>
            ))}
          </div>
          <div className='space-y-8 md:space-y-16'>
            <section id="Reviews"><Reviews reviews={data.reviews} /></section>
            <section id="Cast"><Cast castMembers={data.cast} /></section>
            <section id="MoviePosters"><MovieImages images={data.images} /></section>
          </div>
        </div>
      </div>
    
        </>
    );
}

export default MovieDetails;
