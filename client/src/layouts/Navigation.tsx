import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, LayoutDashboard, Menu, X, Package } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Kasir", icon: ShoppingCart },
    { path: "/product", label: "Master Product", icon: Package },
    { path: "/ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  ];

  return (
    <>
      {/* TOPBAR (MOBILE & TABLET) */}
      <header className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <h1 className="font-bold tracking-wide text-amber-400 text-lg">
          KASIR GROSIR
        </h1>
        <button
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg bg-slate-800 text-gray-200 hover:text-white cursor-pointer"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY BACKDROP (MOBILE & TABLET) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* DRAWER UNTUK MOBILE/TABLET, FIXED SIDEBAR UNTUK DESKTOP */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white p-5 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold tracking-wider text-amber-400">
              KASIR GROSIR
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-semibold shadow-md"
                        : "text-gray-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
