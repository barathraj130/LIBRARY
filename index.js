const express = require('express');
const path = require('path');
const usersRouter = require('./routes/users'); // For users
const booksRouter = require('./routes/books'); // For books

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8081;

// Welcome Route
app.get('/', (req, res) => {
  res.send('Hello, Barath!');
});

// Use users and books routes with appropriate paths
app.use('/users', usersRouter);
app.use('/books', booksRouter); // ✅ Correct path and router

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
