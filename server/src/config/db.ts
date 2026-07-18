import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/launchpilot');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);
    // Do not crash the process in development if MongoDB is not running, just alert.
    console.warn('Backend is running, but MongoDB connection failed. AI services will use mock responses where database persistence fails.');
  }
};
