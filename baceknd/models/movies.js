const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    reviewText: { type: String, required: true }, 
    user: { type: String, required: true } 
});

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    images: [String],
    language: { type: String, required: true },
    genre: [String],
    director: { type: String, required: true },
    trailer: { type: String },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rating: { type: Number, default: 0 }, 
    reviews: [ReviewSchema] ,
    cast:[String]
});

module.exports = mongoose.model('Movie', MovieSchema);
