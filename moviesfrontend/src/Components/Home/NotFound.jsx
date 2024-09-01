import React from 'react'
import movieCollage from '../../assets/movieCollage.jpg'
function NotFound() {
    return (
        <div className='w-full relative  text-white ibm-plex-mono-light-italic h-[34rem] flex justify-center flex-col items-center'>
            <div className='-z-10  bg-opacity-10 bg-black dark:bg-opacity-100  w-full h-full fixed top-0'>
                <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
            </div>
            <p className='text-red-600 text-5xl'>
                404 error
            </p>
            <div className='mt-10 text-black dark:text-white text-2xl text-center flex flex-col gap-5'>
                <p>Oops! The scene you're looking for is missing.</p>
                <p>Let's get you back to the action!</p>
            </div>

            <a href='/' className='text-black dark:text-white my-10  text-xl font-bold hover:text-red-600 dark:hover:text-red-600'>
                Go back to home
            </a>
        </div>
    )
}

export default NotFound