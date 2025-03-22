const express = require('express');
const app = express();

// Define the port
const PORT = process.env.PORT || 3000;

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello, Barath!');
});

// Handle undefined routes (404 error)
app.use((req, res) => {
  res.status(404).json({
    message: 'This is not available',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
