import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/product.js";

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kasir_grosir";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/product", productRoutes);

// Database Connection & Server Start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Database Connected Successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
