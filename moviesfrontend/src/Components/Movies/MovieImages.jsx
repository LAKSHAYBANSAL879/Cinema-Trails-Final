import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function MovieImages({ images, isLoading }) {
    return (
        <div id='Movie Posters' className=''>
            <div className="p-6 dark:bg-gray-800 bg-gray-400 dark:bg-opacity-50 bg-opacity-80 dark:text-white text-black rounded-lg shadow-md w-full my-5 max-w-screen">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <div className="flex items-center px-10 gap-10">
                    {isLoading ? (
                        // Skeleton loaders for each image
                        Array(4).fill(0).map((_, index) => (
                            <div key={index} className="">
                                <Skeleton height={176} width={264} />
                            </div>
                        ))
                    ) : (
                        images.map((image, index) => (
                            <div key={index} className="">
                                <img src={image} className='h-44 w-auto' alt={`movie-poster-${index}`} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieImages;
