import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = Router();

// GET /api/product - Mengambil seluruh produk
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = {};

    if (search && typeof search === "string") {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [{ name: searchRegex }, { sku: searchRegex }],
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Gagal mengambil data produk", error: error.message });
  }
});

// GET /api/product/:id - Mengambil detail 1 produk
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    return res.status(200).json(product);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Gagal mengambil detail produk", error: error.message });
  }
});

// POST /api/product - Menambah produk baru
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, sku, baseUnit, stockInBaseUnit, hppBruto, hppNetto, units } =
      req.body;

    if (hppBruto < 0 || hppNetto < 0 || stockInBaseUnit < 0) {
      return res
        .status(400)
        .json({ message: "HPP dan Stok tidak boleh bernilai negatif!" });
    }

    const existingSku = await Product.findOne({
      sku: sku.toUpperCase().trim(),
    });
    if (existingSku) {
      return res.status(400).json({ message: `SKU '${sku}' sudah terdaftar!` });
    }

    const newProduct = new Product({
      name,
      sku,
      baseUnit,
      stockInBaseUnit: stockInBaseUnit || 0,
      hppBruto: hppBruto || 0,
      hppNetto: hppNetto || 0,
      units: units || [],
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Gagal menambah produk", error: error.message });
  }
});

// PUT /api/product/:id - Update data produk
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, sku, baseUnit, stockInBaseUnit, hppBruto, hppNetto, units } =
      req.body;
    const { id } = req.params;

    if (
      (hppBruto !== undefined && hppBruto < 0) ||
      (hppNetto !== undefined && hppNetto < 0) ||
      (stockInBaseUnit !== undefined && stockInBaseUnit < 0)
    ) {
      return res
        .status(400)
        .json({ message: "HPP dan Stok tidak boleh bernilai negatif!" });
    }

    if (sku) {
      const filter: any = {
        sku: sku.toUpperCase().trim(),
        _id: { $ne: id },
      };

      const existingSku = await Product.findOne(filter);

      if (existingSku) {
        return res
          .status(400)
          .json({ message: `SKU '${sku}' sudah digunakan produk lain!` });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        sku,
        baseUnit,
        stockInBaseUnit,
        hppBruto,
        hppNetto,
        units,
      },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Gagal mengupdate produk", error: error.message });
  }
});

// DELETE /api/product/:id - Menghapus produk
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    return res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Gagal menghapus produk", error: error.message });
  }
});

export default router;
