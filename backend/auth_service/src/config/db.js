const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' Connected to MongoDB Auth DB');
  } catch (err) {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1); // exit the process if DB connection fails
  }
};

module.exports = connectDB;
