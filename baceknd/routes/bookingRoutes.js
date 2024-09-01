const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/addBooking', bookingController.createBooking);
router.delete('/deleteBookingAdmin/:bookingId', bookingController.deleteBooking);
router.delete('/deleteBookingUser/:bookingId', bookingController.cancelBooking);
router.get('/getAllBookings',bookingController.getAllBookings);
router.put('/updateBooking/:bookingId', bookingController.updateBooking);
router.get('/getBooking/:bookingId', bookingController.getBookingById);
router.get('/userBookings/:userId', bookingController.viewBookings);

router.get('/:showTimeId',bookingController.getBookingsByShowtime);



module.exports = router;
