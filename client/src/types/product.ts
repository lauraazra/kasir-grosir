export interface IUnitOption {
  unitName: string;
  conversionRate: number;
  price: number;
}

export interface IProduct {
  _id?: string;
  name: string;
  sku: string;
  baseUnit: string;
  stockInBaseUnit: number;
  hppBruto: number;
  hppNetto: number;
  units: IUnitOption[];
  createdAt?: string;
  updatedAt?: string;
}

export type IProductForm = Omit<IProduct, "_id" | "createdAt" | "updatedAt">;
