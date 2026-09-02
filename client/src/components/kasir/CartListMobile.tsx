import { Trash2 } from "lucide-react";
import type { ICartItem } from "../../types/kasir";

interface Props {
  cart: ICartItem[];
  onQtyChange: (cartId: string, qty: number) => void;
  onUnitChange: (cartId: string, unitName: string) => void;
  onSubtotalChange: (cartId: string, subtotal: number) => void;
  onSubtotalBlur: (cartId: string) => void;
  onRemoveItem: (cartId: string) => void;
}

export function CartListMobile({
  cart,
  onQtyChange,
  onUnitChange,
  onSubtotalChange,
  onSubtotalBlur,
  onRemoveItem,
}: Props) {
  return (
    <div className="md:hidden flex-1 overflow-y-auto space-y-3">
      {cart.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed">
          Belum ada barang di keranjang.
        </div>
      ) : (
        cart.map((item, index) => (
          <div
            key={item.cartId}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-600">
                  #{index + 1}
                </span>
                <h4 className="font-bold text-slate-800">{item.name}</h4>
              </div>
              <button
                onClick={() => onRemoveItem(item.cartId)}
                className="text-red-500 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-gray-500 block mb-1">Satuan</label>
                <select
                  value={item.selectedUnit.unitName}
                  onChange={(e) => onUnitChange(item.cartId, e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-50 font-medium"
                >
                  {item.availableUnits.map((u) => (
                    <option key={u.unitName} value={u.unitName}>
                      {u.unitName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1">Jumlah (Qty)</label>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    onQtyChange(item.cartId, parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded-lg bg-gray-50 font-medium text-center"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-xs text-gray-500">Total Harga:</span>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
                <span className="text-xs font-bold text-amber-700">Rp</span>
                <input
                  type="number"
                  value={item.subtotal || ""}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    onSubtotalChange(
                      item.cartId,
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  onBlur={() => onSubtotalBlur(item.cartId)}
                  className="w-28 font-bold text-slate-900 bg-transparent text-right focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
