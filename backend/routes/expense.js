const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authenticateToken = require('../middleware/auth');
const { validateExpense } = require('../middleware/validate');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images and PDFs are allowed'));
  },
});

router.post('/', authenticateToken, upload.single('receipt'), validateExpense, async (req, res) => {
  const { title, amount, category, project, date, notes } = req.body;
  const userId = req.user.id;
  try {
    const expense = new Expense({
      title,
      amount,
      category,
      project,
      date,
      notes,
      receipt: req.file ? req.file.path : null,
      userId,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;
  try {
    let expenses;
    if (userRole === 'admin') {
      expenses = await Expense.find().populate('userId', 'email role');
    } else if (userRole === 'manager') {
      expenses = await Expense.find({ status: 'pending' }).populate('userId', 'email role');
    } else {
      expenses = await Expense.find({ userId }).populate('userId', 'email role');
    }
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Only require status for approval/rejection
  try {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const expense = await Expense.findByIdAndUpdate(id, { status }, { new: true, runValidators: false });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense: ' + error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

module.exports = router;