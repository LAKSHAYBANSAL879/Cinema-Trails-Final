const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieControllers');
const showTimeController=require("../controllers/showTimeController")

// Add a movie
router.post('/addMovie', movieController.addMovie);
router.put('/updateMovie/:id', movieController.updateMovie);
router.delete('/deleteMovie/:id', movieController.deleteMovie);
router.get('/getAllMovies', movieController.getAllMovies);
router.get('/getMovieDetails/:movieId',movieController.getMovieDetails);
router.get('/getAllTheatersShowtimes/:movieId', showTimeController.getTheatersAndShowtimesForMovie);
router.post('/:movieId/addReview', movieController.addReview);
router.get('/getTopMovies',movieController.getTopMovies)




module.exports=router;