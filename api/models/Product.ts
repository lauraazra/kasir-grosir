import mongoose, { Schema, Document } from "mongoose";

export interface IUnitOption {
  unitName: string;
  conversionRate: number;
  price: number;
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  baseUnit: string;
  stockInBaseUnit: number;
  hppBruto: number;
  hppNetto: number;
  units: IUnitOption[];
  createdAt: Date;
  updatedAt: Date;
}

const unitOptionSchema = new Schema<IUnitOption>({
  unitName: { type: String, required: true },
  conversionRate: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    baseUnit: { type: String, required: true, default: "renceng" },
    stockInBaseUnit: { type: Number, required: true, default: 0, min: 0 },
    hppBruto: { type: Number, required: true, default: 0, min: 0 },
    hppNetto: { type: Number, required: true, default: 0, min: 0 },
    units: [unitOptionSchema],
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>("Product", productSchema);
