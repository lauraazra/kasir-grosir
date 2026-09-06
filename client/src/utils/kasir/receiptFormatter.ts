// utils/receiptFormatter.ts
import type { ICartItem } from "../../types/kasir";

export function generateReceiptText(
  cart: ICartItem[],
  grandTotal: number,
): string {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const padCenter = (text: string, maxLen = 32) => {
    if (text.length >= maxLen) return text;
    const leftSpaces = Math.floor((maxLen - text.length) / 2);
    return " ".repeat(leftSpaces) + text;
  };

  const formatTwoColumns = (left: string, right: string, maxLen = 32) => {
    const spaceCount = Math.max(1, maxLen - (left.length + right.length));
    return left + " ".repeat(spaceCount) + right;
  };

  let text = "";
  text += padCenter("S A M U D R A   K U E") + "\n";
  text += padCenter("Jl. Hamara Effendi, No.262") + "\n";
  text += padCenter("08112113931") + "\n";
  text += "--------------------------------\n";
  text += formatTwoColumns(currentDate, "Kasir: Admin") + "\n";
  text += formatTwoColumns(currentTime, "") + "\n";
  text += "--------------------------------\n";

  cart.forEach((item) => {
    const subtotalStr = `Rp ${item.subtotal.toLocaleString("id-ID")}`;
    const qtyPrice = `${item.qty} ${item.selectedUnit.unitName} x ${item.price}`;

    text += formatTwoColumns(item.name, subtotalStr) + "\n";
    text += qtyPrice + "\n";
  });

  text += "--------------------------------\n";
  text +=
    formatTwoColumns(
      "TOTAL     :",
      `Rp ${grandTotal.toLocaleString("id-ID")}`,
    ) + "\n";
  text += "--------------------------------\n";
  text += padCenter("Terimakasih Atas Kunjungannya") + "\n\n";

  return text;
}
