export interface IUnitOption {
  unitName: string;
  conversionRate: number;
  price: number;
}

export interface IProduct {
  _id: string;
  name: string;
  sku: string;
  baseUnit: string;
  units: IUnitOption[];
}

export interface ICartItem {
  cartId: string;
  productId: string;
  name: string;
  qty: number;
  selectedUnit: IUnitOption;
  availableUnits: IUnitOption[];
  price: number;
  subtotal: number;
}
