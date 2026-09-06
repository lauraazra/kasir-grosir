import { Search, Plus, Minus } from "lucide-react";
import type { IProduct } from "../../types/kasir";

interface Props {
  searchTerm: string;
  isDropdownOpen: boolean;
  filteredProducts: IProduct[];
  selectedIndex: number;
  selectedProduct: IProduct | null;
  qty: number;
  onQtyChange: (newQty: number) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onSelectProduct: (product: IProduct) => void;
  onMouseEnterItem: (index: number) => void;
  onAddToCart: () => void;
}

export function ProductSearchInput({
  searchTerm,
  isDropdownOpen,
  filteredProducts,
  selectedIndex,
  selectedProduct,
  qty,
  onQtyChange,
  onSearchChange,
  onKeyDown,
  onFocus,
  onSelectProduct,
  onMouseEnterItem,
  onAddToCart,
}: Props) {
  return (
    <div className="flex gap-2 relative">
      {/* INPUT QTY (+ & -) */}
      <div className="flex items-center border border-gray-300 bg-white rounded-xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => onQtyChange(Math.max(1, qty - 1))}
          className="p-2 text-gray-500 hover:bg-slate-100 transition cursor-pointer"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          min={1}
          value={qty}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            onQtyChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-7 text-center font-semibold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onQtyChange(qty + 1)}
          className="p-2 text-gray-500 hover:bg-slate-100 transition cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* INPUT SEARCH BARANG */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Cari nama barang / SKU (min. 2 huruf)..."
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          className="w-full p-3 pl-10 rounded-xl border border-gray-300 bg-white shadow-xs focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />

        {isDropdownOpen && searchTerm.trim().length >= 2 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p, index) => (
                <div
                  key={p._id}
                  onClick={() => onSelectProduct(p)}
                  onMouseEnter={() => onMouseEnterItem(index)}
                  className={`p-3 cursor-pointer transition flex justify-between items-center text-slate-800 ${
                    index === selectedIndex
                      ? "bg-amber-100 font-bold"
                      : "hover:bg-amber-50"
                  }`}
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono">
                    {p.sku}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-400 text-center">
                Barang tidak ditemukan
              </div>
            )}
          </div>
        )}
      </div>

      {/* TOMBOL TAMBAH KE KERANJANG */}
      <button
        type="button"
        onClick={onAddToCart}
        disabled={!selectedProduct}
        className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold px-5 py-3 rounded-xl shadow-xs transition cursor-pointer"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
