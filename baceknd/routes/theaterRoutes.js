const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theateController');

router.post('/addTheater', theatreController.addTheatre);
router.put('/updateTheater/:id', theatreController.updateTheatre);
router.delete('/deleteTheater/:id', theatreController.deleteTheatre);
router.get('/getTheaters', theatreController.getTheatres);
router.post('/:theatreId/addMovie', theatreController.addMovieToTheatre);
router.get('/getTheaterCity/:city', theatreController.filterTheatresByCity);
router.get('/getTheatreDetails/:theatreId', theatreController.getTheatreDetails);



module.exports = router;
