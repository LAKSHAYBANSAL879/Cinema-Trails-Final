import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Cast = ({ castMembers, isLoading }) => {
    return (
        <div id='Cast' className="p-6 dark:bg-gray-800 bg-gray-400 dark:bg-opacity-50 bg-opacity-80 dark:text-white text-black rounded-lg shadow-md my-5">
            <h2 className="text-xl font-semibold mb-4">Cast</h2>
            <div className="flex gap-5 mx-10">
                {isLoading ? (
                    // Skeleton loaders for each cast member
                    Array(6).fill(0).map((_, index) => (
                        <div key={index} className="text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                                <Skeleton circle height={80} width={80} />
                            </div>
                            <Skeleton height={20} width={60} />
                        </div>
                    ))
                ) : (
                    castMembers.map((member, index) => (
                        <div key={index} className="text-center">
                            <div
                                className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2"
                            >
                                <FontAwesomeIcon icon={faUser} className='text-black text-2xl' />
                            </div>
                            <p className="text-sm font-medium dark:text-white text-black">{member}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Cast;
