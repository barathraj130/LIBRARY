const express = require('express');
const router = express.Router();
const { Usermodel, Bookmodel } = require('../modals/index');
const moment = require('moment');
// ✅ GET all users
router.get('/', async (req, res) => {
  try {
    const users = await Usermodel.find().populate('issuedBook');
    res.status(200).json({
      success: true,
      message: 'List of all users',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await Usermodel.findById(req.params.id).populate('issuedBook');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      message: 'User found',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ POST - Add a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await Usermodel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'User added successfully!',
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ PUT - Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await Usermodel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found, cannot update',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ DELETE - Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await Usermodel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found, cannot delete',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get('/:id/fine', async (req, res) => {
  try {
    const user = await Usermodel.findById(req.params.id).populate('issuedBook');

    if (!user || !user.subscriptionDate || !user.returnDate) {
      return res.status(400).json({ success: false, message: 'Missing date fields for fine calculation' });
    }

    const fineRules = {
      Basic: { allowedDays: 7, finePerDay: 10 },
      Standard: { allowedDays: 14, finePerDay: 5 },
      Premium: { allowedDays: 30, finePerDay: 0 },
    };

    const { allowedDays, finePerDay } = fineRules[user.subscriptionType] || fineRules.Basic;

    const subDate = moment(user.subscriptionDate, 'D/M/YY');
    const returnDate = moment(user.returnDate, 'D/M/YY');
    const expectedReturn = subDate.clone().add(allowedDays, 'days');

    const overdueDays = Math.max(0, returnDate.diff(expectedReturn, 'days'));
    const fine = overdueDays * finePerDay;

    res.status(200).json({
      success: true,
      data: {
        user: user.name,
        subscriptionType: user.subscriptionType,
        subscriptionDate: subDate.format('DD/MM/YYYY'),
        expectedReturn: expectedReturn.format('DD/MM/YYYY'),
        actualReturn: returnDate.format('DD/MM/YYYY'),
        overdueDays,
        fine,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
