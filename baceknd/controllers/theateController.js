const Theatre = require('../models/theaters');
const Movie = require('../models/movies');
const mongoose=require('mongoose')

exports.addTheatre = async (req, res) => {
    const theatre = new Theatre(req.body);
    try {
        await theatre.save();
        res.status(201).send(theatre);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateTheatre = async (req, res) => {
    try {
        const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!theatre) return res.status(404).send();
        res.send(theatre);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteTheatre = async (req, res) => {
    try {
        const theatre = await Theatre.findByIdAndDelete(req.params.id);
        if (!theatre) return res.status(404).send();
        res.send(theatre);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getTheatres = async (req, res) => {
    try {
        const theatres = await Theatre.find().populate('movies');
        res.send(theatres);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.addMovieToTheatre = async (req, res) => {
    try {
        const theatre = await Theatre.findById(req.params.theatreId);
        if (!theatre) {
            return res.status(404).send({ message: 'Theatre not found' });
        }
        
        const movieId = req.body.movies;  

       
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).send({ message: 'Invalid Movie ID' });
        }

       
        if (!theatre.movies.includes(movieId)) {
            theatre.movies.push(movieId); 
            await theatre.save();  
        }

        res.send(theatre);
    } catch (error) {
        console.error('Error adding movie to theater:', error);
        res.status(400).send({ message: 'Error adding movie to theater', error });
    }
};


exports.filterTheatresByCity = async (req, res) => {
    try {
        const theatres = await Theatre.find({ city: req.params.city }).populate('movies.movie');
        if (!theatres.length) return res.status(404).send({ message: 'No theatres found in this city' });
        res.send(theatres);
    } catch (error) {
        res.status(500).send(error);
    }
};
exports.getTheatreDetails = async (req, res) => {
    try {
      const { theatreId } = req.params;
      const theatre = await Theatre.findById(theatreId);
      if (!theatre) return res.status(404).json({ message: 'theatre not found' });
      res.status(200).json(theatre);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };