const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || !uri.startsWith('mongodb')) {
    throw new Error('MONGO_URI must be a valid MongoDB Atlas connection string');
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
