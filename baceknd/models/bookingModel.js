const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    seats: [{ id: String, tier: String, price: Number,status:String }], 
    totalTickets: Number,
    totalPrice: Number,
    user:{type:mongoose.Schema.Types.ObjectId,ref: 'User'},
    bookedAt: { type: Date, default: Date.now },
    paymentId: {
        type: String,  
      },
      paymentStatus: {
        type: String,
        enum: ['succeeded', 'failed']
      },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
