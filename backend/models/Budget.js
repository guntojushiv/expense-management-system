const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['company', 'team'], required: true },
  team: { type: String }, // For team budgets
  month: { type: String, required: true }, // e.g., "2025-04"
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Budget', budgetSchema);