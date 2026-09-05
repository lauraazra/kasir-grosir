import { useState } from "react";
import { useFetchData } from "../useFetchData";
import type { IProduct, ICartItem } from "../types/kasir";
import { calculateTieredPrice } from "../utils/tieredPriceCalculator";

import { ProductSearchInput } from "../components/kasir/ProductSearchInput";
import { CartTableDesktop } from "../components/kasir/CartTableDesktop";
import { CartListMobile } from "../components/kasir/CartListMobile";
import { KasirFooterBar } from "../components/kasir/KasirFooterBar";
import { ReceiptPrintTemplate } from "../components/kasir/ReceiptPrintTemplate";
import { AlertCircle } from "lucide-react";

export default function KasirPage() {
  const {
    data: products,
    loading,
    error,
  } = useFetchData<IProduct[]>("product");

  const [cart, setCart] = useState<ICartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // FILTER PRODUCT UNTUK SEARCH DROPDOWN
  const filteredProducts =
    searchTerm.trim().length >= 2 && products
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [];

  // HANDLER INPUT SEARCH & NAVIGASI KEYBOARD
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedProduct(null);
    setIsDropdownOpen(true);
    setSelectedIndex(-1);
  };

  const handleSelectProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setSearchTerm(`${product.name} (${product.sku})`);
    setIsDropdownOpen(false);
  };

  const addProductToCart = (product: IProduct) => {
    if (!product || product.units.length === 0) return;
    const defaultUnit = product.units[0];

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product._id &&
          item.selectedUnit.unitName === defaultUnit.unitName,
      );

      if (existingIndex > -1) {
        const updatedCart = [...prev];
        const item = updatedCart[existingIndex];
        const newQty = item.qty + 1;

        const calc = calculateTieredPrice(
          item.availableUnits,
          item.selectedUnit.unitName,
          newQty,
        );

        updatedCart[existingIndex] = {
          ...item,
          qty: newQty,
          price: calc.price,
          subtotal: calc.subtotal,
        };
        return updatedCart;
      }

      const newItem: ICartItem = {
        cartId: `${product._id}-${defaultUnit.unitName}-${Date.now()}`,
        productId: product._id,
        name: product.name,
        qty: 1,
        selectedUnit: defaultUnit,
        availableUnits: product.units,
        price: defaultUnit.price,
        subtotal: defaultUnit.price * 1,
      };
      return [...prev, newItem];
    });

    setSelectedProduct(null);
    setSearchTerm("");
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addProductToCart(selectedProduct);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredProducts.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
        addProductToCart(filteredProducts[selectedIndex]);
      } else if (selectedProduct) {
        addProductToCart(selectedProduct);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  // HANDLER MODIFIKASI ITEM KERANJANG
  const handleUnitChange = (cartId: string, unitName: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const calc = calculateTieredPrice(
            item.availableUnits,
            unitName,
            item.qty,
          );
          return {
            ...item,
            selectedUnit: calc.selectedUnit,
            price: calc.price,
            subtotal: calc.subtotal,
          };
        }
        return item;
      }),
    );
  };

  const handleQtyChange = (cartId: string, newQty: number) => {
    const qty = Math.max(1, newQty);
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const calc = calculateTieredPrice(
            item.availableUnits,
            item.selectedUnit.unitName,
            qty,
          );
          return {
            ...item,
            qty,
            price: calc.price,
            subtotal: calc.subtotal,
          };
        }
        return item;
      }),
    );
  };

  const handleSubtotalChange = (cartId: string, newSubtotal: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const currentQty = item.qty && item.qty > 0 ? item.qty : 1;
          const newUnitPrice = Math.round(newSubtotal / currentQty);

          return {
            ...item,
            subtotal: newSubtotal,
            price: newUnitPrice,
          };
        }
        return item;
      }),
    );
  };

  const handleSubtotalBlur = (cartId: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          if (!item.subtotal || item.subtotal <= 0) {
            const calc = calculateTieredPrice(
              item.availableUnits,
              item.selectedUnit.unitName,
              item.qty || 1,
            );

            return {
              ...item,
              price: calc.price,
              subtotal: calc.subtotal,
            };
          }
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Trigger tombol "Cetak / Simpan"
  const handleOpenConfirmModal = () => {
    if (cart.length === 0) return;
    setIsConfirmModalOpen(true);
  };

  // Eksekusi print & reset keranjang
  const handleConfirmAndPrint = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => {
      window.print();
      setCart([]);
    }, 100);
  };

  // KALKULASI TOTAL UNTUK FOOTER BAR
  const grandTotal = cart.reduce(
    (sum, item) => sum + Number(item.subtotal || 0),
    0,
  );
  const totalItems = cart.length;
  const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  if (loading)
    return (
      <div className="p-6 text-center text-slate-500 font-medium">
        Memuat data produk...
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Error: {error}
      </div>
    );

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-5rem)] justify-between gap-4 print:hidden">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Kasir Toko</h1>
          <ProductSearchInput
            searchTerm={searchTerm}
            isDropdownOpen={isDropdownOpen}
            filteredProducts={filteredProducts}
            selectedIndex={selectedIndex}
            selectedProduct={selectedProduct}
            onSearchChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(true)}
            onSelectProduct={handleSelectProduct}
            onMouseEnterItem={(idx) => setSelectedIndex(idx)}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Tabel Desktop View */}
        <CartTableDesktop
          cart={cart}
          onQtyChange={handleQtyChange}
          onUnitChange={handleUnitChange}
          onSubtotalChange={handleSubtotalChange}
          onSubtotalBlur={handleSubtotalBlur}
          onRemoveItem={handleRemoveItem}
        />

        {/* List Mobile View */}
        <CartListMobile
          cart={cart}
          onQtyChange={handleQtyChange}
          onUnitChange={handleUnitChange}
          onSubtotalChange={handleSubtotalChange}
          onSubtotalBlur={handleSubtotalBlur}
          onRemoveItem={handleRemoveItem}
        />

        {/* Footer Info & Action */}
        <KasirFooterBar
          grandTotal={grandTotal}
          totalItems={totalItems}
          totalQty={totalQty}
          onPrintAndSave={handleOpenConfirmModal}
          isCartEmpty={cart.length === 0}
        />
      </div>

      {/* MODAL KONFIRMASI AKHIR TRANSAKSI */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Konfirmasi Transaksi
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Apakah Anda setuju mengakhiri transaksi?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAndPrint}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition cursor-pointer"
              >
                Setuju & Cetak
              </button>
            </div>
          </div>
        </div>
      )}

      <ReceiptPrintTemplate cart={cart} grandTotal={grandTotal} />
    </>
  );
}
