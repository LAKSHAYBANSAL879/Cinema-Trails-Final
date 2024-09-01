const mongoose = require('mongoose');

const TheatreSchema = new mongoose.Schema({
    name: String,
    state: String,
    seats: Number,
    city: String,
    country:String,
    images: [String],
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

module.exports = mongoose.model('Theatre', TheatreSchema);
