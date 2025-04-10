const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/users');
const budgetRoutes = require('./routes/budget'); // New route
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/auth', limiter);
app.use('/api/expense', limiter);

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/budget', budgetRoutes); // Add budget route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));