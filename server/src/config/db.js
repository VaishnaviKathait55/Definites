import mongoose from 'mongoose';

export async function connectDatabase(connectionString) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(connectionString);
  console.log('MongoDB connected');
}
