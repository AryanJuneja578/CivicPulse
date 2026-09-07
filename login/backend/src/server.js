const express = require('express');
const cors = require('cors');//middleware
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CivicPulse API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error: ' + err.message
  });
});

const PORT = process.env.PORT || 5000;

// Start server if not imported by test suite
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`CivicPulse Backend server running on port ${PORT}`);
    });
  });
}

module.exports = app;
