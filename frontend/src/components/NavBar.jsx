import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { UtensilsCrossed, ShoppingBag, Sparkles, User, Menu, X, Flame } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const { itemCount, totalKcal, studentName } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Menu", icon: UtensilsCrossed },
    { to: "/order", label: "My Order", icon: ShoppingBag, badge: itemCount > 0 ? itemCount : null },
    { to: "/specials", label: "Today's Specials", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-charcoal">Campus<span className="text-primary-600">Bite</span></span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-primary-700">Canteen</span>
              </div>
              <p className="hidden sm:block text-[11px] text-gray-500 font-medium">Smart Campus Pre-Order</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-primary-600 shadow-sm shadow-gray-200 font-bold"
                        : "text-gray-600 hover:text-charcoal hover:bg-white/60"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-primary-600 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section: Student Badge & Live Cart Button */}
          <div className="flex items-center gap-3">
            {/* Student Name display if entered */}
            {studentName ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100 text-xs font-semibold text-primary-700">
                <div className="w-6 h-6 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{studentName}</span>
              </div>
            ) : null}

            {/* Live Calorie Indicator in Header (Subtle) */}
            {totalKcal > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs font-semibold text-amber-800">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>{totalKcal} / 1000 kcal</span>
              </div>
            )}

            {/* Cart Link with Live Badge */}
            <Link
              to="/order"
              id="nav-cart-btn"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal text-white hover:bg-black transition-all shadow-sm group active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              <span
                id="cart-badge-count"
                className={`flex items-center justify-center px-1.5 py-0.5 min-w-[20px] h-5 rounded-full text-[11px] font-bold transition-all ${
                  itemCount > 0 ? "bg-primary-500 text-white animate-pulse" : "bg-gray-700 text-gray-300"
                }`}
              >
                {itemCount}
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {studentName && (
            <div className="flex items-center gap-2 p-2.5 bg-orange-50 rounded-xl text-xs font-semibold text-primary-700 mb-2">
              <User className="w-4 h-4" />
              <span>Ordering as: {studentName}</span>
            </div>
          )}
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-600 font-bold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-primary-600 text-white rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
