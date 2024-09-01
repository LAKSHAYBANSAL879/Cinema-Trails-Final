const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Booking = require('../models/bookingModel');
const Showtime = require('../models/showtimeModel');
const Theatre = require('../models/theaters');
const Movie = require('../models/movies');
const User = require('../models/userModel');

const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'lbansal879880@gmail.com',
      pass: 'tajuooanjzkslnnn'
    }
  });

exports.createBooking = async (req, res) => {
    const { showtime, theatre, movie, selectedSeats, totalTickets, totalPrice, user,paymentId } = req.body;

    try {
        // Fetch related documents from the database
        const showtimeDoc = await Showtime.findById(showtime);
        const theatreDoc = await Theatre.findById(theatre);
        const movieDoc = await Movie.findById(movie);
        const userDoc = await User.findById(user);

        // Validate that all referenced documents exist
        if (!showtimeDoc || !theatreDoc || !movieDoc || !userDoc) {
            return res.status(404).send({ message: 'Showtime, Theatre, Movie, or User not found' });
        }

        // Update seat statuses within the showtime document
        selectedSeats.forEach(seat => {
            const seatToUpdate = showtimeDoc.seats.find(s => s.id === seat.id);
            if (seatToUpdate) {
                seatToUpdate.status = 'booked';
            }
        });

        // Save the updated showtime document
        await showtimeDoc.save();
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).send({ message: 'Payment failed', paymentIntent });
        }
        // Create a new booking document
        const booking = new Booking({
            showtime: showtimeDoc._id,
            theatre: theatreDoc._id,
            movie: movieDoc._id,
            seats: selectedSeats,
            totalTickets,
            totalPrice,
            user: userDoc._id,
            paymentId: paymentIntent.id,
            paymentStatus: paymentIntent.status 
        });

        // Save the booking to the database
        await booking.save();

        // Email content
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: userDoc.email, // Sending email to the user
            subject: 'Booking Confirmation',
            text: `Dear ${userDoc.name},\n\nYour booking was successful! Here are your booking details:\n\n` +
                `Ticket ID: ${booking._id}\n` +
                `Movie: ${movieDoc.title}\n` +
                `Theatre: ${theatreDoc.name}\n` +
                `Address:${theatreDoc.city}`+
                ` ,${theatreDoc.state}`+
                ` ,${theatreDoc.country}\n`+
                `Showtime: ${(showtimeDoc.startDate).toLocaleDateString()} ${showtimeDoc.time}\n` +
                `Seats: ${selectedSeats.map(seat => seat.id).join(', ')}\n\n` +
                `Total Tickets: ${totalTickets}\n` +
                `Total Price: Rs${totalPrice}\n\n` +
                `Thank you for booking with us!\n\nBest Regards,\nCinema Trails`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(201).send({ message: 'Booking successful and email sent', booking });
    } catch (error) {
        console.error('Error during booking:', error);
        res.status(500).send({ message: error.message });
    }
};

// Delete a booking (Admin only)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a booking (Admin only)
exports.updateBooking = async (req, res) => {
    try {
        const { movieId, theatreId, seats, totalTickets, totalPrice, user } = req.body;

        // Validate IDs if provided
        if (movieId) {
            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
        }

        if (theatreId) {
            const theatre = await Theatre.findById(theatreId);
            if (!theatre) {
                return res.status(404).json({ message: 'Theatre not found' });
            }
        }

        if (user) {
            const userId = await User.findById(user);
            if (!userId) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { movie: movieId, theatre: theatreId, seats, totalTickets, totalPrice, user },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get booking details by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('movie')
            .populate('theatre')
            .populate('showtime')
            .populate('user');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cancel a booking (Customer)
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.bookingId).populate('showtime');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update seat statuses to 'available'
        booking.seats.forEach(seat => {
            const seatToUpdate = booking.showtime.seats.find(s => s.id === seat.id);
            if (seatToUpdate) {
                seatToUpdate.status = 'available';
            }
        });

        // Save the updated showtime
        await booking.showtime.save();
        await booking.save();

        res.json({ message: 'Booking canceled and seats made available', booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// View bookings for a user
exports.viewBookings = async (req, res) => {
    const {userId}=req.params;
    try {
        const bookings = await Booking.find({user:userId})
        .populate('movie')
        .populate('theatre')
        .populate('user')
        .populate('showtime')
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get bookings by showtime
exports.getBookingsByShowtime = async (req, res) => {
    const { showtimeId } = req.params;

    try {
        const bookings = await Booking.find({ showtime: showtimeId });
        res.send(bookings);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.getAllBookings = async (req, res) => {
    try {
        const bookingDetails = await Booking.find().populate('theatre').populate('movie').populate('user').populate('showtime'); 
        res.status(200).json(bookingDetails);
      } catch (error) {
        res.status(500).send('Server Error');
      }
  };