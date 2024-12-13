const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { jobId, rating, comment } = req.body;
  const userId = req.user.id;

  console.log(`[CREATE REVIEW] Received data: jobId=${jobId}, userId=${userId}, rating=${rating}, comment=${comment}`);

  try {
    const review = await Review.create({ jobId, userId, rating, comment });
    console.log(`[CREATE REVIEW] Review created successfully: ${JSON.stringify(review)}`);
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error(`[CREATE REVIEW ERROR] ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  const { jobId } = req.query;

  console.log(`[GET REVIEWS] Received query: jobId=${jobId}`);

  try {
    const reviews = await Review.find({ jobId }).populate('userId', 'email');
    console.log(`[GET REVIEWS] Found reviews: ${JSON.stringify(reviews)}`);
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(`[GET REVIEWS ERROR] ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  console.log(`[DELETE REVIEW] Received request to delete review with id=${id}`);

  try {
    const review = await Review.findByIdAndDelete(id);
    if (review) {
      console.log(`[DELETE REVIEW] Review deleted successfully: ${JSON.stringify(review)}`);
      res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      console.log(`[DELETE REVIEW] No review found with id=${id}`);
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    console.error(`[DELETE REVIEW ERROR] ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
