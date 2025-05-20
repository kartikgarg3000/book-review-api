const Review = require('../models/Review');
const Book = require('../models/Book');

const createReview = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        // Check if user already reviewed this book
        const existingReview = await Review.findOne({ user: userId, book: bookId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }

        const review = await Review.create({
            user: userId,
            book: bookId,
            rating,
            comment
        });

        // Update book's average rating and review count
        const bookReviews = await Review.find({ book: bookId });
        const averageRating = bookReviews.reduce((acc, item) => item.rating + acc, 0) / bookReviews.length;
        
        await Book.findByIdAndUpdate(bookId, {
            averageRating,
            reviewCount: bookReviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        Object.assign(review, req.body);
        await review.save();

        res.json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    updateReview,
    deleteReview
};