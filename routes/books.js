const express = require('express');
const router = express.Router();
const { Usermodel, Bookmodel } = require('../modals/index');
const fs = require('fs');
const path = require('path');

// ✅ Function to update books.json
async function updateBooksJson() {
  try {
    const books = await Bookmodel.find();
    const jsonPath = path.join(__dirname, '../data/books.json');
    fs.writeFileSync(jsonPath, JSON.stringify(books, null, 2));
    console.log('books.json updated successfully');
  } catch (err) {
    console.error("Error updating books.json:", err);
  }
}

// ✅ GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Bookmodel.find();
    res.status(200).json({
      success: true,
      message: 'List of all books',
      data: books,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET issued books with user info
router.get('/issued', async (req, res) => {
  try {
    const users = await Usermodel.find().populate('issuedBook');

    const issuedBooks = users
      .filter(user => user.issuedBook)
      .map(user => ({
        ...user.issuedBook._doc,
        issuedBy: user.name,
        issuedDate: user.issued_date || "N/A",
        returnDate: user.returnDate || "N/A",
        subscriptionType: user.subscriptionType || "N/A",
      }));

    if (issuedBooks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books have been issued yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "Users with issued books",
      data: issuedBooks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Bookmodel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found, try again',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book found successfully!',
      data: book,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ POST - Add a new book
router.post('/', async (req, res) => {
  try {
    const newBook = await Bookmodel.create(req.body);

    // 🔄 Update JSON file
    updateBooksJson();

    res.status(201).json({
      success: true,
      message: 'Book added successfully!',
      data: newBook,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ PUT - Update book by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Bookmodel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Book not found, cannot update',
      });
    }

    // 🔄 Update JSON file
    updateBooksJson();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully!',
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ DELETE - Delete book by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Bookmodel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Book not found, cannot delete',
      });
    }

    // 🔄 Update JSON file
    updateBooksJson();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully!',
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
