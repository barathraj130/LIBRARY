const express = require('express');
const { users } = require("./data/user.json"); // Importing user data

const app = express(); // Initialize app first
app.use(express.json()); // Middleware after initialization

// Define the port
const PORT = process.env.PORT || 8081;

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello, Barath!');
});

// Get all users
app.get("/user", (req, res) => {
  res.status(200).json({
    success: true,
    data: users, // Correct variable name
  });
});

// Get a user by ID
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  console.log("Requested ID:", id);
  console.log("User data:", users);

  // Search for the user in the users array
  const foundUser = users.find((each) => each.id == id);

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: "User not found, try again",
    });
  }

  res.status(200).json({
    success: true,
    message: "You got it",
    data: foundUser,
  });
});

// Add a new user
app.post("/users", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

  const user = users.find((each) => each.id == id);

  if (user) {
    return res.status(409).json({ // 409 for conflict
      success: false,
      message: "The user is already here, provide another",
    });
  }

  users.push({
    id,
    name,
    surname,
    email,
    "issued_book": req.body["issued book"], // Correct with quotes
    "issued_date": req.body["issued date"], // Correct with quotes
    subscriptionType,
    subscriptionDate,
  });
  

  return res.status(201).json({
    success: true,
    message: "User added successfully!",
    data: users,
  });
});

// Handle undefined routes (404 error)
app.use((req, res, next) => {
  res.status(404).json({
    message: "This is not available",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
