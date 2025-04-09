// seed.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Bookmodel, Usermodel } = require('./modals/index');
const connectDB = require('./db');

const booksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/books.json'), 'utf-8')).books;
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/user.json'), 'utf-8')).users;

const seedDB = async () => {
  try {
    await connectDB();

    await Bookmodel.deleteMany();
    await Usermodel.deleteMany();

    console.log("🧹 Cleared old data");

    // 1. Add customId to books so we can match users
    const booksToInsert = booksData
      .filter(book => book.name)
      .map(book => ({
        name: book.name,
        author: book.author,
        price: book.price,
        genre: book.genre,
        publisher: book.publisher,
        customId: book.id // add this for lookup
      }));

    const insertedBooks = await Bookmodel.insertMany(booksToInsert);

    // 2. Match user.issued_book with book.customId
    const transformedUsers = usersData
      .map(user => {
        const matchedBook = insertedBooks.find(b => b.customId == user.issued_book);
        if (!matchedBook) {
          console.log(`⛔ Skipping user ${user.name} — no matching book for ID: ${user.issued_book}`);
          return null;
        }

        return {
          name: user.name,
          surname: user.surname,
          email: user.email,
          issuedBook: matchedBook._id,
          returnDate: user.return_date || null,
          subscriptionType: user.subscriptionType || 'Basic',
          subscriptionDate: user.subscriptionDate || new Date().toISOString(),
        };
      })
      .filter(user => user !== null);

    console.log(`📘 Inserted books: ${insertedBooks.length}`);
    console.log(`👤 Users to insert: ${transformedUsers.length}`);

    await Usermodel.insertMany(transformedUsers);
    console.log("✅ Seeded users and books into MongoDB");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    process.exit(1);
  }
};

seedDB();
