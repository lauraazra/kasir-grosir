import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Product from "./models/Product.js";

// Cari file .env baik saat dijalankan dari folder root maupun dari folder /api
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const dummyProducts = [
  {
    name: "Top Box (Delfi Top)",
    sku: "TOP-001",
    baseUnit: "box",
    stockInBaseUnit: 60,
    units: [
      { unitName: "box", conversionRate: 1, price: 15000 },
      { unitName: "dus", conversionRate: 6, price: 85000 },
    ],
  },
  {
    name: "Pocari Kaleng 330ml",
    sku: "POC-001",
    baseUnit: "kaleng",
    stockInBaseUnit: 120,
    units: [
      { unitName: "kaleng", conversionRate: 1, price: 7000 },
      { unitName: "dus", conversionRate: 24, price: 160000 },
    ],
  },
  {
    name: "Sabena Stick",
    sku: "SAB-001",
    baseUnit: "pack",
    stockInBaseUnit: 25,
    units: [
      { unitName: "pack", conversionRate: 1, price: 12000 },
      { unitName: "dus", conversionRate: 5, price: 55000 },
    ],
  },
  {
    name: "Marimas",
    sku: "MAR-001",
    baseUnit: "renceng",
    stockInBaseUnit: 120,
    units: [
      { unitName: "renceng", conversionRate: 1, price: 3500 },
      { unitName: "pack", conversionRate: 12, price: 39000 },
      { unitName: "dus", conversionRate: 72, price: 216000 },
    ],
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI tidak ditemukan di file .env!");
    }

    await mongoose.connect(mongoUri);
    console.log("Terhubung ke MongoDB Atlas...");

    await Product.deleteMany({});
    await Product.insertMany(dummyProducts);

    console.log("Data dummy berhasil dimasukkan ke MongoDB Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("Gagal seeding data:", error);
    process.exit(1);
  }
};

seedDB();
