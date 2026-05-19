const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/media-optimizer';

  try {
    await mongoose.connect(uri);

    console.log('Dashboard connected to MongoDB');
  } catch (err) {
    console.error('Dashboard DB connect error', err.message);
    process.exit(1);
  }
};