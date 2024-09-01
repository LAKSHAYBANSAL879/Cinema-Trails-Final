import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import nextSVG from '../../assets/angle-right-solid.svg';
import previousSVG from '../../assets/angle-left-solid.svg';
import './styles.css';
import { Link } from 'react-router-dom';

const MoviesComedy = () => {
    const [movies, setMovies] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const cardRefs = useRef([]);
    const cardDetailRefs = useRef([]);
    const cardWidth = 300;
    const itemsVisible = 5;
    const totalCards = movies.length;
    const maxOffset = (totalCards - itemsVisible) * cardWidth;

    useEffect(() => {
        axios.get('https://cinema-trails.onrender.com/api/v1/movies/getAllMovies')
            .then(response => {
                const comedyMovies = response.data.filter(movie => movie.genre.includes('Comedy'));
                setMovies(comedyMovies);
                setLoading(false);  // Data is loaded
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                setLoading(false);  // Even if there's an error, stop loading
            });
    }, []);

    const handleNext = () => {
        setCurrent((prev) => {
            const newIndex = Math.min(prev + 1, totalCards - itemsVisible);
            const offset = Math.min(newIndex * cardWidth, maxOffset);
            gsap.to(carouselRef.current, {
                x: -offset,
                duration: 0.5,
                ease: 'power2.out',
            });
            return newIndex;
        });
    };

    const handlePrev = () => {
        setCurrent((prev) => {
            const newIndex = Math.max(prev - 1, 0);
            const offset = Math.min(newIndex * cardWidth, maxOffset);
            gsap.to(carouselRef.current, {
                x: -offset,
                duration: 0.5,
                ease: 'power2.out',
            });
            return newIndex;
        });
    };

    const handleMouseEnter = (index) => {
        if (cardRefs.current[index]) {
            gsap.to(cardRefs.current[index], { scale: 1.25, duration: 0.3, zIndex: "40" });
            gsap.to(cardDetailRefs.current[index], { display: "block", duration: 0.05 });
        }
    };

    const handleMouseLeave = (index) => {
        if (cardRefs.current[index]) {
            gsap.to(cardRefs.current[index], { scale: 1, duration: 0.3, zIndex: "0" });
            gsap.to(cardDetailRefs.current[index], { display: "none", duration: 0.05 });
        }
    };

    return (
        <div className="dark:text-white text-black h-full py-8 overflow-hidden duration-500 transition-all">
            <div className="container mx-auto px-4 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Stream Comedy Movies</h2>
                </div>
                <div className="relative h-full">
                    <div className="">
                        <div
                            ref={carouselRef}
                            className="flex"
                            style={{ width: `${cardWidth * totalCards}px` }}
                        >
                            {loading ? (
                                Array.from({ length: itemsVisible }).map((_, index) => (
                                    <div key={index} style={{ width: cardWidth }} className="flex-shrink-0 h-96 p-2">
                                        <Skeleton height="100%" />
                                    </div>
                                ))
                            ) : (
                                movies.map((movie, index) => (
                                    <div
                                        key={index}
                                        style={{ "width": cardWidth }}
                                        ref={(el) => (cardRefs.current[index] = el)}
                                        className="flex-shrink-0 h-96 p-2"
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={() => handleMouseLeave(index)}
                                    >
                                        <div className="relative w-full h-full my-5 pb-6">
                                            <div
                                                ref={(el) => (cardDetailRefs.current[index] = el)}
                                                className='bg-black bg-opacity-80 rounded-lg border-black absolute w-full h-full hidden z-10'
                                            >
                                                <div className='py-8 px-8'>
                                                    <p className="text-xl font-semibold text-white">{movie.title}</p>
                                                    <p className="pt-4 text-xs text-white ">{movie.description}</p>
                                                    <div className='flex gap-2'>
                                                        <div id='buttons'>
                                                            <Link to={`movieDetails/${movie._id}`} style={{ "--clr": "#0067F8" }}>
                                                                <span>Explore</span>
                                                                <i></i>
                                                            </Link>
                                                            <Link to={`/movie/showListing/${movie._id}`} style={{ "--clr": "#ff1867" }}>
                                                                <span>Book Now</span>
                                                                <i></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <img src={movie.images[0]} alt={movie.title} className="w-full h-full object-cover rounded-lg" />
                                            <div className="rounded-b-lg p-2">
                                                <p className="text-sm">{movie.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {current > 0 && (
                        <button
                            onClick={handlePrev}
                            className="absolute z-50 top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-r-lg"
                        >
                            <img src={previousSVG} alt="Previous" />
                        </button>
                    )}
                    {current < totalCards - itemsVisible && (
                        <button
                            onClick={handleNext}
                            className="absolute z-50 top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-l-lg"
                        >
                            <img src={nextSVG} alt="Next" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoviesComedy;
