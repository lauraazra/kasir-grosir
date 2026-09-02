import { Printer } from "lucide-react";

interface Props {
  grandTotal: number;
  totalItems: number;
  totalQty: number;
  isCartEmpty: boolean;
  onPrintAndSave: () => void;
}

export function KasirFooterBar({
  grandTotal,
  totalItems,
  totalQty,
  isCartEmpty,
  onPrintAndSave,
}: Props) {
  const isDisablePrint = isCartEmpty || totalQty <= 0 || grandTotal <= 0;

  return (
    <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
      <button
        onClick={onPrintAndSave}
        disabled={isDisablePrint}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-md transition cursor-pointer"
      >
        <Printer size={20} />
        <span>Print / Simpan</span>
      </button>

      <div className="text-center sm:text-right w-full sm:w-auto">
        <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-wide">
          Total Transaksi: Rp {grandTotal.toLocaleString("id-ID")}
        </div>
        <div className="flex justify-center sm:justify-end gap-3 text-xs sm:text-sm text-gray-300 mt-1">
          <span>
            Total Item: <strong className="text-white">{totalItems}</strong>
          </span>
          <span>|</span>
          <span>
            Total QTY: <strong className="text-white">{totalQty}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
