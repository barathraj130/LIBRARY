const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const filePath = path.join(__dirname, "./data/user.json");
let { users } = require(filePath);

const PORT = process.env.PORT || 8081;

// Welcome Route
app.get('/', (req, res) => {
  res.send('Hello, Barath!');
});

// Get all users
app.get("/user", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

// Get user by ID
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  console.log("Requested ID:", id);

  const foundUser = users.find((each) => each.id == id);

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: "User not found, try again",
    });
  }

  res.status(200).json({
    success: true,
    message: "User found successfully!",
    data: foundUser,
  });
});

// Add a new user
app.post("/users", (req, res) => {
  const {
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
    issued_book,
    issued_date,
  } = req.body;

  // Check if the ID already exists
  const user = users.find((each) => each.id == id);
  if (user) {
    return res.status(409).json({
      success: false,
      message: "The user already exists, provide another ID",
    });
  }

  // Create a new user object
  const newUser = {
    id,
    name,
    surname,
    email,
    issued_book,
    issued_date,
    subscriptionType,
    subscriptionDate,
  };

  // Add the new user to the list
  users.push(newUser);

  // Update user.json file
  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2), "utf8");

  return res.status(201).json({
    success: true,
    message: "User added successfully!",
    data: users,
  });
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const user = users.find((each) => each.id == id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User doesn't exist",
    });
  }

  // Update user data
  users = users.map((each) => {
    if (each.id == id) {
      return {
        ...each,
        ...data, // Merge updated data
      };
    }
    return each;
  });

  // Write updated data to the file
  fs.writeFile(filePath, JSON.stringify({ users }, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user data in file",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: users,
    });
  });
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex((each) => each.id == id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found, cannot delete",
    });
  }

  // Remove the user
  users.splice(userIndex, 1);

  // Write updated data to the file
  fs.writeFile(filePath, JSON.stringify({ users }, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete user from file",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: users,
    });
  });
});

// Handle invalid routes
app.use((req, res, next) => {
  res.status(404).json({
    message: "This is not available",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
