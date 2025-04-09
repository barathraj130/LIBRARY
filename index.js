const express = require('express');
const path = require('path');
const usersRouter = require('./routes/users'); // For users
const booksRouter = require('./routes/books'); // For books
const connectDB = require('./db'); // ✅ correct

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

// Connect to MongoDB
connectDB();

// Welcome Route
app.get('/', (req, res) => {
  res.send('Hello, Barath!');
});

// Use users and books routes
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: 'This route is not available',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});