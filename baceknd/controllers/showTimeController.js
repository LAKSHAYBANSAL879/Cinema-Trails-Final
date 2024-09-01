const Showtime = require('../models/showtimeModel');
const Movie = require('../models/movies');
const Theatre = require('../models/theaters');
const Booking=require("../models/bookingModel");
const mongoose = require('mongoose');

exports.createShowtime = async (req, res) => {
    const { startDate,endDate, movie, theatre, time, ticketPrices } = req.body;

    try {
        const theatreDoc = await Theatre.findById(theatre);
        if (!theatreDoc) return res.status(404).send({ message: 'Theatre not found' });

       

        const showTimeHour = parseInt(time.slice(0, 2));
        const discountMultiplier = showTimeHour < 12 ? 0.7 : 1;

        const discountedTicketPrices = {
            executive: ticketPrices.executive * discountMultiplier,
            gold: ticketPrices.gold * discountMultiplier,
            silver: ticketPrices.silver * discountMultiplier
        };

        const showtime = new Showtime({
            startDate,
            endDate,
            movie,
            theatre,
            time,
            ticketPrices: discountedTicketPrices
        });

        await showtime.save();
        res.status(201).send(showtime);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateShowtime = async (req, res) => {
    const { id } = req.params;
    try {
        const showtime = await Showtime.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!showtime) return res.status(404).send({ message: 'Showtime not found' });
        res.send(showtime);
    } catch (error) {
        res.status(400).send(error);
    }
};


exports.deleteShowtime = async (req, res) => {
    const { id } = req.params;
    try {
        const showtime = await Showtime.findByIdAndDelete(id);
        if (!showtime) return res.status(404).send({ message: 'Showtime not found' });
        res.send({ message: 'Showtime deleted' });
    } catch (error) {
        res.status(400).send(error);
    }
};


exports.getShowtimes = async (req, res) => {
    try {
        const showtimes = await Showtime.find().populate('movie').populate('theatre');
        res.send(showtimes);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getShowtimeById = async (req, res) => {
    try {
        const { showtimeId } = req.params;  
        const showtime = await Showtime.findById(showtimeId);  
        if (!showtime) {
            return res.status(404).send({ message: "Showtime not found" });
        }
        res.send(showtime);
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
};


exports.getShowtimesByTheatre = async (req, res) => {
    const { theatreId } = req.params;
    try {
        const showtimes = await Showtime.find({ theatre: theatreId }).populate('movie').populate('theatre');
        if (!showtimes.length) return res.status(404).send({ message: 'No showtimes found for this theatre' });
        res.send(showtimes);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.getShowtimesByMovie = async (req, res) => {
    const { movieId } = req.params;
    try {
        const showtimes = await Showtime.find({ movie: movieId }).populate('movie').populate('theatre');
        if (!showtimes.length) return res.status(404).send({ message: 'No showtimes found for this movie' });
        res.send(showtimes);
    } catch (error) {
        res.status(500).send(error);
    }
};
exports.getShowtimesByDateAndTheatre = async (req, res) => {
    const { date, theatreId, movieId } = req.params;

    if (!date || !theatreId || !movieId) {
        return res.status(400).send({ message: 'Missing required parameters' });
    }

    if (!mongoose.Types.ObjectId.isValid(theatreId) || !mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).send({ message: 'Invalid ObjectId format' });
    }
    try {
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const showtimes = await Showtime.find({
            startDate: { $gte: startOfDay, $lte: endOfDay },
            theatre: theatreId,
            movie: movieId
        })

        if (!showtimes.length) {
            return res.status(404).send({ message: 'No showtimes found for this date and theatre' });
        }

        res.send(showtimes);
    } catch (error) {
        console.error('Error fetching showtimes:', error);
        res.status(500).send({ message: 'Server error' });
    }
};
exports.getTheatersAndShowtimesForMovie = async (req, res) => {
    const { movieId } = req.params;

    try {
        // Fetch showtimes for the given movie, populating theatre and movie data
        const showtimes = await Showtime.find({ movie: movieId })
            .populate('theatre')
            .populate('movie');

        // If no showtimes found, return a 404 error
        if (!showtimes.length) {
            return res.status(404).send({ message: 'No showtimes found for this movie' });
        }

        // Prepare the response object
        const response = {};

        showtimes.forEach(showtime => {
            const theatreId = showtime.theatre._id;

            // Initialize the theatre in the response object if not already present
            if (!response[theatreId]) {
                response[theatreId] = {
                    theatre: showtime.theatre,
                    showtimes: []
                };
            }

            // Add the showtime to the respective theatre in the response
            response[theatreId].showtimes.push({
                date: showtime.startDate,
                time: showtime.time,
                ticketPrices: showtime.ticketPrices,
                id: showtime._id,
                movieId: movieId,
                theaterId: theatreId
            });
        });

        // Send the response as an array of theater objects
        res.send(Object.values(response));
    } catch (error) {
        // Log the error and return a 500 status with the error message
        console.error('Failed to fetch theaters and showtimes:', error);
        res.status(500).send({ message: 'Failed to fetch theaters and showtimes', error });
    }
};

exports.getSeatsForShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.showtimeId).populate('theatre');
        if (!showtime) return res.status(404).send('Showtime not found');

        if (!showtime.seats || showtime.seats.length === 0) {
            const theatre = showtime.theatre;
            const totalSeats = theatre.seats;

            const executiveSeats = Math.floor(totalSeats * 0.2);
            const goldSeats = Math.floor(totalSeats * 0.3);
            const silverSeats = totalSeats - executiveSeats - goldSeats;

            const seats = [];

            // Function to generate rows dynamically
            const generateRows = (totalSeatsInTier, startCharCode) => {
                const rows = [];
                const seatsPerRow = 16; // Assume 16 seats per row as a standard
                const totalRows = Math.ceil(totalSeatsInTier / seatsPerRow);
                for (let i = 0; i < totalRows; i++) {
                    rows.push(String.fromCharCode(startCharCode + i)); // Generate row names starting from the given char code
                }
                return rows;
            };

            // Initialize the starting character for rows
            let startCharCode = 65; // ASCII code for 'A'

            // Generate rows for each tier
            const executiveRows = generateRows(executiveSeats, startCharCode);
            startCharCode += executiveRows.length; // Update the starting character for the next tier

            const goldRows = generateRows(goldSeats, startCharCode);
            startCharCode += goldRows.length; // Update the starting character for the next tier

            const silverRows = generateRows(silverSeats, startCharCode);

            // Function to generate seats for each tier
            const generateSeats = (tier, rows, totalSeatsInTier, price) => {
                let seatIndex = 1;
                for (let i = 0; i < totalSeatsInTier; i++) {
                    const row = rows[Math.floor(i / 16)]; // 16 seats per row
                    seats.push({
                        id: `${row}${seatIndex}`,
                        tier,
                        price,
                        status: 'available',
                        theatreid: showtime.theatre._id,
                        movieid: showtime.movie._id
                    });
                    seatIndex++;
                    if (seatIndex > 16) seatIndex = 1; // Reset seat index after each row
                }
            };

            // Generate seats for each tier
            generateSeats('executive', executiveRows, executiveSeats, showtime.ticketPrices.executive);
            generateSeats('gold', goldRows, goldSeats, showtime.ticketPrices.gold);
            generateSeats('silver', silverRows, silverSeats, showtime.ticketPrices.silver);

            showtime.seats = seats;
            await showtime.save();
        }

        const bookings = await Booking.find({ showtime: req.params.showtimeId });
        const bookedSeatIds = bookings.flatMap(booking => booking.seats.map(seat => seat.id));

        showtime.seats.forEach(seat => {
            seat.status = bookedSeatIds.includes(seat.id) ? 'booked' : 'available';
        });

        res.send(showtime.seats);
    } catch (error) {
        res.status(500).send(error.message);
    }
};