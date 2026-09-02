import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import KasirPage from "./pages/KasirPage";
import MasterProductPage from "./pages/MasterProductPage";

// Dummy Page dulu
const RingkasanPage = () => (
  <h2 className="text-2xl font-bold">Halaman Ringkasan</h2>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<KasirPage />} />
          <Route path="product" element={<MasterProductPage />} />
          <Route path="ringkasan" element={<RingkasanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
