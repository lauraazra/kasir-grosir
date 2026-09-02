import type { IUnitOption } from "../types/kasir";

export function calculateTieredPrice(
  availableUnits: IUnitOption[],
  selectedUnitName: string,
  qty: number,
) {
  const currentUnit =
    availableUnits.find((u) => u.unitName === selectedUnitName) ||
    availableUnits[0];

  const totalBaseQty = qty * currentUnit.conversionRate;
  const sortedUnits = [...availableUnits].sort(
    (a, b) => b.conversionRate - a.conversionRate,
  );

  const applicableTier =
    sortedUnits.find((u) => totalBaseQty >= u.conversionRate) || currentUnit;

  const pricePerBaseUnit = applicableTier.price / applicableTier.conversionRate;

  const effectiveUnitPrice = Math.round(
    pricePerBaseUnit * currentUnit.conversionRate,
  );
  const subtotal = Math.round(effectiveUnitPrice * qty);

  return {
    selectedUnit: currentUnit,
    price: effectiveUnitPrice,
    subtotal,
  };
}
