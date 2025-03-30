const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the user data file
const filePath = path.join(__dirname, '../data/user.json');

// Read user data from file
const getUserData = () => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data).users || [];
};

// Write user data to file
const updateUserData = (users) => {
  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2), 'utf8');
};

// ✅ Get all users
router.get('/', (req, res) => {
  const users = getUserData();
  res.status(200).json({
    success: true,
    message: 'List of all users',
    data: users,
  });
});

// ✅ Get a user by ID
router.get('/:id', (req, res) => {
  const users = getUserData();
  const { id } = req.params;
  const foundUser = users.find((each) => each.id == id);

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found, try again',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User found successfully!',
    data: foundUser,
  });
});

// ➕ Add a new user
router.post('/', (req, res) => {
  const users = getUserData();
  const {
    id,
    name,
    surname,
    email,
    issued_book,
    issued_date,
    subscriptionType,
    subscriptionDate,
  } = req.body;

  // Check if the ID already exists
  const user = users.find((each) => each.id == id);
  if (user) {
    return res.status(409).json({
      success: false,
      message: 'The user already exists, provide another ID',
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
  updateUserData(users);

  return res.status(201).json({
    success: true,
    message: 'User added successfully!',
    data: newUser,
  });
});

// ✏️ Update user by ID
router.put('/:id', (req, res) => {
  const users = getUserData();
  const { id } = req.params;
  const data = req.body;

  const userIndex = users.findIndex((each) => each.id == id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User doesn't exist",
    });
  }

  // Update user data
  users[userIndex] = { ...users[userIndex], ...data };
  updateUserData(users);

  return res.status(200).json({
    success: true,
    message: 'User updated successfully!',
    data: users[userIndex],
  });
});

// ❌ Delete a user by ID
router.delete('/:id', (req, res) => {
  const users = getUserData();
  const { id } = req.params;

  const userIndex = users.findIndex((each) => each.id == id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found, cannot delete',
    });
  }

  // Remove the user
  const deletedUser = users.splice(userIndex, 1);
  updateUserData(users);

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully!',
    data: deletedUser[0],
  });
});

module.exports = router;
