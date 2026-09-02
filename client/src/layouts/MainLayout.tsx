import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-slate-800 flex flex-col lg:flex-row">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 lg:p-6 transition-all">
        <Outlet />
      </main>
    </div>
  );
};
