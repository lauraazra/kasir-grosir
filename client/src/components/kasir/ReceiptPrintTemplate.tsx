// components/kasir/ReceiptPrintTemplate.tsx
import { generateReceiptText } from "../../utils/kasir/receiptFormatter";
import type { ICartItem } from "../../types/kasir";

interface Props {
  cart: ICartItem[];
  grandTotal: number;
}

export function ReceiptPrintTemplate({ cart, grandTotal }: Props) {
  const receiptText = generateReceiptText(cart, grandTotal);

  return (
    <pre
      id="printable-receipt"
      className="hidden print:block text-black bg-white"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "11px",
        lineHeight: "1.2",
        whiteSpace: "pre-wrap",
        width: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      {receiptText}
    </pre>
  );
}
