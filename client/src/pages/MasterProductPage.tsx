import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { IProduct, IProductForm } from "../types/product";
import { ProductModal } from "../components/product/ProductModal";

export default function MasterProductPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch data dari backend Express
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/product");
      if (!res.ok) throw new Error("Gagal mengambil data produk");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan tidak dikenal");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  // Filter produk berdasarkan nama atau SKU
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  // Kalkulasi Mini Metrics Dashboard
  const metrics = useMemo(() => {
    if (!products) return { totalSku: 0, totalAssetValue: 0, lowStockCount: 0 };

    const totalSku = products.length;
    const totalAssetValue = products.reduce(
      (sum, p) => sum + (p.stockInBaseUnit || 0) * (p.hppNetto || 0),
      0,
    );
    const lowStockCount = products.filter(
      (p) => (p.stockInBaseUnit || 0) <= 10,
    ).length;

    return { totalSku, totalAssetValue, lowStockCount };
  }, [products]);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Integrasi Tambah (POST) & Edit (PUT) ke Backend
  const handleFormSubmit = async (formData: IProductForm) => {
    try {
      const isEdit = Boolean(selectedProduct?._id);
      const url = isEdit
        ? `/api/product/${selectedProduct!._id}`
        : "/api/product";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (!res.ok) {
        alert(resData.message || "Gagal menyimpan data produk");
        return;
      }

      setIsModalOpen(false);
      fetchProducts();

      showToast(`Data "${formData.name}" berhasil tersimpan!`);
    } catch (err) {
      if (err instanceof Error) {
        alert("Terjadi kesalahan jaringan: " + err.message);
      } else {
        alert("Terjadi kesalahan jaringan");
      }
    }
  };

  // Hapus (DELETE) Backend
  const handleDeleteProduct = async (id?: string) => {
    if (!id) return;
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });

      const resData = await res.json();

      if (!res.ok) {
        alert(resData.message || "Gagal menghapus produk");
        return;
      }

      // Reload data terbaru
      fetchProducts();
    } catch (err) {
      if (err instanceof Error) {
        alert("Terjadi kesalahan jaringan: " + err.message);
      } else {
        alert("Terjadi kesalahan jaringan");
      }
    }
  };

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-300 animate-bounce">
          <CheckCircle2 size={20} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Product</h1>
          <p className="text-xs text-slate-500">
            Kelola data stok, HPP Bruto/Netto, dan tiered pricing multi-satuan
            grosir.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus size={18} />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Mini Metrics Dashboard */}
      <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
        <div className="min-w-65 flex-1 snap-start bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Total Jenis Produk
            </div>
            <div className="text-2xl font-black text-slate-800">
              {metrics.totalSku} SKU
            </div>
          </div>
        </div>

        <div className="min-w-65 flex-1 snap-start bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Total Nilai Stok (HPP Netto)
            </div>
            <div className="text-2xl font-black text-slate-800">
              Rp {metrics.totalAssetValue.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        <div className="min-w-65 flex-1 snap-start bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Alert Stok Tipis (&le; 10)
            </div>
            <div className="text-2xl font-black text-amber-600">
              {metrics.lowStockCount} Produk
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari produk berdasarkan nama atau SKU..."
          className="w-full bg-transparent focus:outline-none text-sm text-slate-800"
        />
      </div>

      {/* Layout Tabel Master Produk */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-175">
            <thead className="bg-slate-100 border-b border-gray-200 text-slate-700 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap">
                  SKU & Nama Produk
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  Stok Terkini
                </th>
                <th className="py-3 px-4 text-right whitespace-nowrap">
                  HPP Bruto
                </th>
                <th className="py-3 px-4 text-right whitespace-nowrap">
                  HPP Netto
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  Opsi Satuan & Harga Jual
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-slate-800 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-50 transition group"
                  >
                    <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-50">
                      <div className="font-bold text-slate-800">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {product.sku}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block font-bold text-xs px-2.5 py-1 rounded-full ${
                          product.stockInBaseUnit <= 10
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {product.stockInBaseUnit} {product.baseUnit}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-gray-500 font-medium whitespace-nowrap">
                      {product.hppBruto
                        ? `Rp ${product.hppBruto.toLocaleString("id-ID")}`
                        : "-"}
                    </td>

                    <td className="py-3 px-4 text-right text-emerald-700 font-bold whitespace-nowrap">
                      {product.hppNetto
                        ? `Rp ${product.hppNetto.toLocaleString("id-ID")}`
                        : "-"}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-nowrap md:flex-wrap gap-1.5 min-w-55">
                        {product.units?.map((u, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-medium whitespace-nowrap"
                          >
                            1 {u.unitName}: Rp {u.price.toLocaleString("id-ID")}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Component */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedProduct}
      />
    </div>
  );
}
