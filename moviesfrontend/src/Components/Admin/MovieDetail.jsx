import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router";
const MovieDetail = () => {
    const [movie, setMovie] = useState({
        title: '',
        images: '',
        language: '',
        genre: '',
        director: '',
        trailer: '',
        description: '',
        duration: '',
        startDate: "",
        endDate: '',
        rating: 0,
        cast: ''
    });
    const { movieId } = useParams();

    useEffect(() => {
        // Define the async function inside useEffect
        const fetchMovies = async () => {
            try {
                const response = await axios.get('https://cinema-trails.onrender.com/api/v1/movies/getAllMovies');
                console.log(response);
                const data = response.data.filter(m => m._id === movieId);
                console.log(data[0]);
                setMovie(data[0]);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        // Call the async function
        fetchMovies();
    }, [movieId]);
    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                    Edit
                </button>
            </div>

            {/* Movie Details */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">Language:</h3>
                    <p className="text-gray-600">{movie.language}</p>
                </div>

                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">Genre:</h3>
                    <p className="text-gray-600">{movie.genre&&movie.genre.join(', ')}</p>
                </div>

                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">Director:</h3>
                    <p className="text-gray-600">{movie.director}</p>
                </div>

                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">Duration:</h3>
                    <p className="text-gray-600">{movie.duration} minutes</p>
                </div>

                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">Start Date:</h3>
                    <p className="text-gray-600">
                        {new Date(movie.startDate).toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">End Date:</h3>
                    <p className="text-gray-600">
                        {new Date(movie.endDate).toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">Rating:</h3>
                    <p className="text-gray-600">{movie.rating} / 10</p>
                </div>

                <div>
                    <h3 className="text-gray-800 text-sm font-semibold">Cast:</h3>
                    <p className="text-gray-600">{movie.cast&&movie.cast.join(', ')}</p>
                </div>

                <div className="sm:col-span-2">
                    <h3 className="text-gray-800 text-sm font-semibold">Description:</h3>
                    <p className="text-gray-600">{movie.description}</p>
                </div>

                <div className="sm:col-span-2">
                    <h3 className="text-gray-800 text-sm font-semibold">Trailer:</h3>
                    {movie.trailer ? (
                        <a
                            href={movie.trailer}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Watch Trailer
                        </a>
                    ) : (
                        <p className="text-gray-600">No trailer available</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <h3 className="text-gray-800 text-sm font-semibold">Reviews:</h3>
                    <ul className="text-gray-600">
                        {movie.reviews.length>0?movie.reviews.map((review, index) => (
                            <li key={index} className="mb-2">
                                {review}
                            </li> 
                        )):"No reviews available"}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;