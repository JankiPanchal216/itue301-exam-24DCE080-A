import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MenuPage from "./pages/MenuPage";
import OrderPage from "./pages/OrderPage";
import SpecialsPage from "./pages/SpecialsPage";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
        <NavBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/specials" element={<SpecialsPage />} />
          </Routes>
        </div>
        <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} CampusBite — Smart Campus Canteen Pre-Order System</p>
            <p className="text-gray-400">ITUE301 Practical Examination • Set A</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
