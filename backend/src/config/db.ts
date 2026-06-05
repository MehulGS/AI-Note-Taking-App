import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB connection error';

    if (!env.REQUIRE_DATABASE) {
      console.warn(`MongoDB unavailable. Starting API without database connection. ${message}`);
      return;
    }

    console.error('MongoDB connection failed. Check MONGODB_URI, DNS, Atlas network access, and database credentials.');
    throw error;
  }
}
