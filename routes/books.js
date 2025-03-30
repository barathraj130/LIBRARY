const express = require('express');
const router = express.Router();
const { books } = require("../data/books.json");
const { users } = require("../data/user.json");
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'List of all books',
        data: books,  // <-- use books instead of booksData
    });
});
router.get("/issued", (req, res) => {
    // Filter users with issued books
    const userwiththeissuedbook = users.filter((each) => each.issued_book);

    const issuedbooks = [];

    userwiththeissuedbook.forEach((each) => {
        // Find the corresponding book by ID
        const book = books.find((book) => book.id == each.issued_book);

        if (book) {
            book.issuedby = each.name;
            book.issueddate = each.issued_date;
            book.returndate = each.return_date || "N/A";

            issuedbooks.push(book);
        }
    });

    if (issuedbooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No books have been issued yet",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Users with issued books...",
        data: issuedbooks,
    });
});



router.get('/:id', (req, res) => {
    const { id } = req.params;

    // Find the book by id
    const foundBook = books.find((each) => each.id == id);

    if (!foundBook) {
        return res.status(404).json({
            success: false,
            message: 'Book not found, try again',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Book found successfully!',
        data: foundBook,
    });
});



module.exports = router;
