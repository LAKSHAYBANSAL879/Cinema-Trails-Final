import React from 'react'
import MoviesPoster from './MoviesPoster'
import Movies from './Movies'
import MoviesComedy from './MoviesComedy'
import MoviesDrama from './MoviesDrama'
import movieCollage from '../../assets/movieCollage.jpg';


const Home = () => {
  return (
    <div className='relative'>
      <div className='-z-10  bg-opacity-10 bg-black dark:bg-opacity-100  w-full h-full fixed top-0'>
        <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
      </div>
      <MoviesPoster />
      <Movies />
      <MoviesComedy />
      <MoviesDrama />
    </div>
  )
}

export default Home