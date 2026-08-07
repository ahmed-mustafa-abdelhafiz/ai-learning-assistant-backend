import mongoose from 'mongoose';
import { afterAll, beforeAll } from 'vitest';

beforeAll(async () => {
  const uri = process.env.TEST_MONGODB_URI;
  if (!uri) {
    throw new Error('TEST_MONGODB_URI is not set');
  }
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
