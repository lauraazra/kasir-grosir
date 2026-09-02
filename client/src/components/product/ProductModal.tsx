import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { IProduct, IProductForm, IUnitOption } from "../../types/product";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IProductForm) => void;
  initialData?: IProduct | null;
}

const emptyForm: IProductForm = {
  name: "",
  sku: "",
  baseUnit: "",
  stockInBaseUnit: 0,
  hppBruto: 0,
  hppNetto: 0,
  units: [{ unitName: "", conversionRate: 0, price: 0 }],
};

export function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<IProductForm>(emptyForm);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name,
        sku: initialData.sku,
        baseUnit: initialData.baseUnit,
        stockInBaseUnit: initialData.stockInBaseUnit,
        hppBruto: initialData.hppBruto,
        hppNetto: initialData.hppNetto,
        units: initialData.units || [],
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleUnitChange = (
    index: number,
    field: keyof IUnitOption,
    value: string | number,
  ) => {
    const updatedUnits = [...formData.units];
    updatedUnits[index] = {
      ...updatedUnits[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, units: updatedUnits }));
  };

  const addUnitRow = () => {
    setFormData((prev) => ({
      ...prev,
      units: [...prev.units, { unitName: "", conversionRate: 1, price: 0 }],
    }));
  };

  const removeUnitRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden my-8">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* Informasi Dasar */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Kopi Kapal Api Mix 20g"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  SKU / Barcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="KPL-API-001"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Base Unit (Satuan Terkecil){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.baseUnit || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, baseUnit: e.target.value || "" })
                  }
                  placeholder="renceng / pcs / kg"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Stok Terkini ({formData.baseUnit || "Base Unit"})
                </label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  value={formData.stockInBaseUnit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockInBaseUnit: Math.max(
                        0,
                        parseFloat(e.target.value) || 0,
                      ),
                    })
                  }
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Komponen HPP & Modal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Komponen HPP (Modal per Base Unit)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  HPP Bruto (Modal Awal per {formData.baseUnit || "Unit"})
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-amber-500">
                  <span className="text-xs font-bold text-gray-400 mr-2">
                    Rp
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={formData.hppBruto || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hppBruto: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    placeholder="12000"
                    className="w-full text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  HPP Netto (Modal Riil Setelah Diskon Supplier)
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-amber-500">
                  <span className="text-xs font-bold text-gray-400 mr-2">
                    Rp
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={formData.hppNetto || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hppNetto: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    placeholder="11200"
                    className="w-full text-sm font-semibold focus:outline-none text-emerald-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Multi-Satuan & Harga Grosir */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Tiered Pricing & Multi-Satuan Grosir
              </h3>
              <button
                type="button"
                onClick={addUnitRow}
                className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition"
              >
                <Plus size={14} /> Tambah Satuan
              </button>
            </div>

            <div className="space-y-3">
              {formData.units.map((u, idx) => {
                const modalSatuan = formData.hppNetto * u.conversionRate;
                const marginRp = u.price - modalSatuan;
                const marginPercent =
                  u.price > 0 ? ((marginRp / u.price) * 100).toFixed(1) : "0";

                return (
                  <div
                    key={idx}
                    className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-200"
                  >
                    <div className="w-full md:w-32">
                      <label className="text-[10px] text-gray-400 block mb-1">
                        Nama Satuan
                      </label>
                      <input
                        type="text"
                        placeholder="dus / pack"
                        value={u.unitName}
                        onChange={(e) =>
                          handleUnitChange(idx, "unitName", e.target.value)
                        }
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                      />
                    </div>

                    <div className="w-full md:w-36">
                      <label className="text-[10px] text-gray-400 block mb-1">
                        Isi ({formData.baseUnit || "baseUnit"})
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={u.conversionRate}
                        onChange={(e) =>
                          handleUnitChange(
                            idx,
                            "conversionRate",
                            Math.max(1, parseFloat(e.target.value) || 1),
                          )
                        }
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-center focus:outline-none"
                      />
                    </div>

                    <div className="w-full md:w-44">
                      <label className="text-[10px] text-gray-400 block mb-1">
                        Harga Jual (Rp)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={u.price || ""}
                        onChange={(e) =>
                          handleUnitChange(
                            idx,
                            "price",
                            Math.max(0, parseFloat(e.target.value) || 0),
                          )
                        }
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-bold text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="w-full md:w-32 text-center">
                      <label className="text-[10px] text-gray-400 block mb-1">
                        Est. Margin
                      </label>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md ${
                          Number(marginPercent) >= 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {marginPercent}%
                      </span>
                    </div>

                    <div className="w-full md:w-auto flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeUnitRow(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Modal Action */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
