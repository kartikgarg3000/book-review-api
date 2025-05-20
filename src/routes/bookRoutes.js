const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    addBook,
    getAllBooks,
    getBookById,
    searchBooks
} = require('../controllers/bookController');

router.post('/', protect, addBook);
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

module.exports = router;