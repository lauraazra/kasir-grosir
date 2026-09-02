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

export function CartTableDesktop({
  cart,
  onQtyChange,
  onUnitChange,
  onSubtotalChange,
  onSubtotalBlur,
  onRemoveItem,
}: Props) {
  return (
    <div className="hidden md:block flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-col">
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 sticky top-0 border-b border-gray-200 text-slate-700 text-sm font-bold">
            <tr>
              <th className="py-3 px-4 w-12 text-center border-r">No</th>
              <th className="py-3 px-4 border-r">Nama Produk</th>
              <th className="py-3 px-4 w-28 text-center border-r">Jumlah</th>
              <th className="py-3 px-4 w-36 border-r">Satuan</th>
              <th className="py-3 px-4 w-36 border-r">Harga @</th>
              <th className="py-3 px-4 w-44 border-r">Harga Total</th>
              <th className="py-3 px-4 w-12 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-slate-800 text-sm">
            {cart.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  Belum ada barang di keranjang.
                </td>
              </tr>
            ) : (
              cart.map((item, index) => (
                <tr key={item.cartId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-center border-r font-medium text-gray-500">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border-r font-semibold">
                    {item.name}
                  </td>
                  <td className="py-2 px-3 border-r text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        onQtyChange(item.cartId, parseInt(e.target.value))
                      }
                      className="w-16 p-1.5 border rounded-lg text-center bg-gray-50 focus:bg-white focus:ring-1 focus:ring-amber-500"
                    />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <select
                      value={item.selectedUnit.unitName}
                      onChange={(e) =>
                        onUnitChange(item.cartId, e.target.value)
                      }
                      className="w-full p-1.5 border rounded-lg bg-gray-50 focus:bg-white font-medium text-slate-700 cursor-pointer"
                    >
                      {item.availableUnits.map((u) => (
                        <option key={u.unitName} value={u.unitName}>
                          {u.unitName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 border-r text-gray-600 font-medium">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2 px-3 border-r">
                    <div className="flex items-center gap-1 bg-amber-50/50 border border-amber-200 rounded-lg px-2 py-1">
                      <span className="text-xs font-bold text-amber-700">
                        Rp
                      </span>
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
                        className="w-full bg-transparent font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => onRemoveItem(item.cartId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
