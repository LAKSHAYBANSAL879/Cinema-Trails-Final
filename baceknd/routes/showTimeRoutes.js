const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showTimeController');

router.post('/addshowTime', showtimeController.createShowtime);
router.put('/updateshowTime/:id', showtimeController.updateShowtime);
router.delete('/deleteshowTime/:id', showtimeController.deleteShowtime);
router.get('/getAllShows', showtimeController.getShowtimes);
router.get('/getShowtimeById/:showtimeId', showtimeController.getShowtimeById);
router.get('/getshowTimeTheatre/:theatreId', showtimeController.getShowtimesByTheatre);
router.get('/getShowTimeMovie/:movieId', showtimeController.getShowtimesByMovie);
router.get('/getshowTimeDate/:date/theatre/:theatreId/movie/:movieId', showtimeController.getShowtimesByDateAndTheatre);
router.get('/:showtimeId/seats', showtimeController.getSeatsForShowtime);


module.exports = router;
