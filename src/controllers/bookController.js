const Book = require('../models/Book');

const addBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllBooks = async (req, res) => {
    try {
        // Pagination and filtering
        const { page = 1, limit = 10, author, genre } = req.query;
        const query = {};
        
        if (author) query.author = new RegExp(author, 'i');
        if (genre) query.genre = new RegExp(genre, 'i');

        const books = await Book.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Book.countDocuments(query);

        res.json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search books by title or author(Additional feature)
const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        const books = await Book.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { author: new RegExp(query, 'i') }
            ]
        })
        .select('title author genre averageRating reviewCount')
        .limit(10);

        res.json({
            status: 'success',
            results: books.length,
            data: {
                books
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    searchBooks
};