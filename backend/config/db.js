const mongoose = require('mongoose');

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) return cachedConnection;
  if (cachedPromise) return cachedPromise;

  const uri = process.env.MONGO_URI;
  if (!uri || !uri.startsWith('mongodb')) {
    throw new Error('MONGO_URI must be a valid MongoDB Atlas connection string');
  }

  cachedPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000
  }).then((conn) => {
    cachedConnection = conn.connection;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return cachedConnection;
  }).catch((error) => {
    cachedPromise = null;
    throw error;
  });

  return cachedPromise;
};

module.exports = connectDB;
