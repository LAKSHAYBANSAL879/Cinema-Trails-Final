const Movie = require('../models/movies');
const Booking=require('../models/bookingModel')
// Add a new movie
exports.addMovie = async (req, res) => {
    try {
      const movie = new Movie(req.body);
    
    
    // const movie = Movie.create(req.body);
    // console.log(movie);
      await movie.save();
      res.status(201).json(movie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Delete a movie
exports.deleteMovie = async (req, res) => {
    try {
      const { id } = req.params;
      await Movie.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update an existing movie
exports.updateMovie = async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addReview = async (req, res) => {
  try {
      const { movieId } = req.params;
      const { rating, reviewText, user } = req.body;

      
      if (rating < 1 || rating > 10) {
          return res.status(400).json({ error: "Rating should be between 1 and 10." });
      }

      const movie = await Movie.findById(movieId);
      if (!movie) {
          return res.status(404).json({ error: "Movie not found." });
      }

      const newReview = {
          rating,
          reviewText,
          user
      };

      
      movie.reviews.push(newReview);


      const totalRating = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
      movie.rating = totalRating / movie.reviews.length;

      await movie.save();

      res.status(201).json(movie);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
exports.getMovieDetails = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTopMovies = async (req, res) => {
  try {
    const topMovies = await Booking.aggregate([
      {
        $group: {
          _id: '$movie',
          totalSpent: { $sum: '$totalPrice' },
          totalTickets: { $sum: '$totalTickets' },
        },
      },
      {
        $sort: { totalTickets: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movieDetails',
        },
      },
      {
        $unwind: '$movieDetails',
      },
      {
        $project: {
          _id: 0,
          movieId: '$_id',
          totalSpent: 1,
          totalTickets: 1,
          name: '$movieDetails.title',
        },
      },
    ]);

    res.status(200).json(topMovies);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};