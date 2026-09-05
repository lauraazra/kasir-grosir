import type { ICartItem } from "../../types/kasir";

interface Props {
  cart: ICartItem[];
  grandTotal: number;
}
const BLANK_LINE = " \n";

export function ReceiptPrintTemplate({ cart, grandTotal }: Props) {
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

  const formatTwoColumns = (left: string, right: string, maxLen = 32) => {
    const spaceCount = Math.max(1, maxLen - (left.length + right.length));
    return left + " ".repeat(spaceCount) + right;
  };

  const padCenter = (text: string, maxLen = 32) => {
    if (text.length >= maxLen) return text;
    const totalSpaces = maxLen - text.length;
    const leftSpaces = Math.floor(totalSpaces / 2);
    return " ".repeat(leftSpaces) + text;
  };

  return (
    <div
      id="printable-receipt"
      className="hidden print:block text-black bg-white"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "11px",
        lineHeight: "1.2",
        whiteSpace: "pre-wrap",
        width: "100%",
      }}
    >
      {/* Header Struk */}
      <div>{padCenter("S A M U D R A   K U E")}</div>
      <div>{padCenter("Jl. Hamara Effendi, No.262")}</div>
      <div>{padCenter("08112113931")}</div>

      <div>--------------------------------</div>

      {/* Tanggal & Kasir */}
      <div>{formatTwoColumns(currentDate, "Kasir: Admin")}</div>
      <div>{formatTwoColumns(currentTime, "")}</div>

      <div>--------------------------------</div>

      {/* Item Belanja */}
      {cart.map((item) => {
        const itemLine = `${item.name}`;
        const qtyPrice = `${item.qty} ${item.selectedUnit.unitName} x ${item.price}`;
        const subtotalStr = `Rp ${item.subtotal.toLocaleString("id-ID")}`;

        return (
          <div key={item.cartId} style={{ marginBottom: "2px" }}>
            <div>{formatTwoColumns(itemLine, subtotalStr)}</div>
            <div>{qtyPrice}</div>
          </div>
        );
      })}

      <div>--------------------------------</div>

      {/* Ringkasan */}
      <div style={{ fontWeight: "bold" }}>
        {formatTwoColumns(
          "TOTAL     :",
          `Rp ${grandTotal.toLocaleString("id-ID")}`,
        )}
      </div>

      <div>--------------------------------</div>

      {/* Footer Struk */}
      <div>{padCenter("Terimakasih Atas Kunjungannya")}</div>

      {BLANK_LINE}
      {BLANK_LINE}
      {BLANK_LINE}
    </div>
  );
}
