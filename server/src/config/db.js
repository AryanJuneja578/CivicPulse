const mongoose = require('mongoose');

/**
 * Reusable MongoDB Connection Module
 * Connects to MongoDB using MONGODB_URI environment variable
 * Throws on failure so caller can handle initialization lifecycle
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civicpulse';

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
