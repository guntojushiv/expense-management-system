const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const authenticateToken = require('../middleware/auth');
const Joi = require('joi');

// Validation schema for budget
const validateBudget = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string().valid('company', 'team').required(),
    team: Joi.string().when('type', { is: 'team', then: Joi.required() }),
    month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(), // e.g., "2025-04"
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

router.post('/', authenticateToken, validateBudget, async (req, res) => {
  const { amount, type, team, month } = req.body;
  const userId = req.user.id;
  try {
    const budget = new Budget({ amount, type, team, month, createdBy: userId });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget: ' + error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const userRole = req.user.role;
  try {
    let budgets;
    if (userRole === 'admin') {
      budgets = await Budget.find(); // Admin sees all budgets
    } else if (userRole === 'manager') {
      budgets = await Budget.find({ type: 'team' }); // Manager sees team budgets
    }
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets: ' + error.message });
  }
});

module.exports = router;