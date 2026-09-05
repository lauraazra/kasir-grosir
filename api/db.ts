import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load file .env dari folder root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export const connectDB = async () => {
  // Kalau koneksi sudah terbuka, tidak perlu reconnect (penting untuk Vercel serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // Ambil MONGODB_URI dari .env
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI tidak ditemukan di file .env!");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected to Atlas: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    throw error;
  }
};
