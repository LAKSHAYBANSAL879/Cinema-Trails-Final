const mongoose = require('mongoose');


const seatSchema = new mongoose.Schema({
    id: String,
    tier: String,
    status: { type: String, default: 'available' },  
    price: Number,
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
});

const ShowtimeSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    ticketPrices: {
        executive: Number,
        gold: Number,
        silver: Number
    },
    time: String,
    seats: [seatSchema] 
});

module.exports = mongoose.model('Showtime', ShowtimeSchema);
