import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async () => {
  try {
    // Use in-memory MongoDB for development if no MONGO_URI is provided
    if (!process.env.MONGO_URI) {
      console.log('No MONGO_URI provided, starting in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      process.env.MONGO_URI = mongoUri;
      console.log('In-memory MongoDB started at:', mongoUri);
    }

    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoServer) {
    await mongoServer.stop();
    console.log('In-memory MongoDB stopped');
  }
  process.exit(0);
});
