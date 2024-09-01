import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
import { Box, Typography, Rating, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  background: '#fff',
  color: '#fff',
  marginLeft: '10px',
  fontSize: '0.7em',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 400,
  padding: '9px 15px',
  transition: '0.5s',
  textDecoration: 'none',
  borderRadius: '4px',
  '&:hover': {
    background: 'var(--clr)',
    color: '#fff',
    letterSpacing: '0.25em',
    boxShadow: '0 0 35px var(--clr)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    inset: '2px',
    background: '#27282c',
  },
  '& span': {
    position: 'relative',
    zIndex: 1,
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '24px',
  transition: '0.3s',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
  },
  '&.prev': {
    left: '10px',
  },
  '&.next': {
    right: '10px',
  },
}));

const MovieInfo = styled(motion.div)`
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  &:hover {
    transform: perspective(1000px) rotateY(5deg) translateZ(50px);
  }
`;

function MoviesPoster() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://cinema-trails.onrender.com/api/v1/movies/getAllMovies');
        const allMovies = response.data;
        const randomMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 5);
        setMovies(randomMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Swiper
      modules={[Autoplay, Navigation, EffectFade, Parallax]}
      spaceBetween={0}
      slidesPerView={1}
      navigation={{
        prevEl: '.prev',
        nextEl: '.next',
      }}
      autoplay={{
        delay: 10000,
        disableOnInteraction: false,
      }}
      loop
      effect="fade"
      parallax={true}
      style={{ height: 'calc(100vh - 300px)' }}
    >
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <SwiperSlide key={index}>
            <Box
              className="movie-slide"
              data-swiper-parallax="-300"
              sx={{
                backgroundColor: '#ccc',
              }}
            >
              <Box className="content-wrapper">
                <MovieInfo>
                  <Skeleton height={40} width="70%" style={{ marginBottom: '10px' }} />
                  <Skeleton height={30} width="50%" style={{ marginBottom: '10px' }} />
                  <Skeleton height={20} width="30%" style={{ marginBottom: '10px' }} />
                  <Skeleton count={3} />
                </MovieInfo>
              </Box>
            </Box>
          </SwiperSlide>
        ))
      ) : (
        movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <Box
              className="movie-slide"
              data-swiper-parallax="-300"
              sx={{
                backgroundImage: `url(${movie.images[1]})`,
              }}
            >
              <Box className="content-wrapper">
                <MovieInfo
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography variant="h2" color="white" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Rating value={movie.rating / 2} readOnly precision={0.1} />
                    <Typography variant="body1" color="white">
                      {movie.rating.toFixed(1)}
                    </Typography>
                    {movie.genre.map((genres, idx) => (
                      <Typography key={idx} variant="body2" color="white" className="genre-tag">
                        {genres}
                      </Typography>
                    ))}
                  </Stack>
                  <Typography variant="body1" color="white" mb={3}>
                    {movie.description}
                  </Typography>

                  <div id="buttons">
                    <Link to={`movieDetails/${movie._id}`} style={{ "--clr": "#0067F8" }}>
                      <span>Explore</span>
                      <i></i>
                    </Link>
                    <Link to={`/movie/showListing/${movie._id}`} style={{ "--clr": "#ff1867" }}>
                      <span>Book Now</span>
                      <i></i>
                    </Link>
                  </div>
                </MovieInfo>
              </Box>
            </Box>
          </SwiperSlide>
        ))
      )}
      <NavButton className="prev nav-button">&lt;</NavButton>
      <NavButton className="next nav-button">&gt;</NavButton>
    </Swiper>
  );
}

export default MoviesPoster;
