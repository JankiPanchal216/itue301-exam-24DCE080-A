import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, Utensils, Coffee, Soup, Pizza, ChevronRight } from "lucide-react";
import MenuCard from "../components/MenuCard";
import { menu } from "../data/menu";
import { useCart } from "../context/CartContext";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem, itemCount, calorieError, toastMessage } = useCart();

  const categories = [
    { id: "all", label: "All Items", icon: Utensils },
    { id: "snack", label: "Snacks", icon: Pizza },
    { id: "meal", label: "Meals", icon: Soup },
    { id: "drink", label: "Drinks", icon: Coffee },
  ];

  const filteredMenu =
    selectedCategory === "all"
      ? menu
      : menu.filter((item) => item.category?.toLowerCase() === selectedCategory);

  return (
    <main className="min-h-screen pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 border ${
              toastMessage.type === "error"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-100/60 via-orange-50/30 to-transparent pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-orange-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200/80 text-primary-700 text-xs font-bold tracking-wide mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Good Food. Great Campus Vibes.</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight leading-tight mb-4">
              Cravings Meet <span className="text-primary-600">Convenience.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 font-medium mb-6 leading-relaxed">
              Your favorite campus meals, ready when you are. Discover delicious chef-prepared options, track your calories in real-time, and pre-order to skip the lunch rush.
            </p>

            {/* Action buttons & live counter */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#menu-section"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
              >
                <span>Browse Menu</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <Link
                to="/order"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-charcoal font-semibold text-sm shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-primary-600" />
                <span>View Current Order ({itemCount})</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Menu Section */}
      <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Calorie Limit Alert (if triggered) */}
        {calorieError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-between gap-3 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{calorieError}</span>
            </div>
            <Link to="/order" className="text-xs underline font-bold hover:text-rose-900">
              Manage Order
            </Link>
          </div>
        )}

        {/* Section Header with Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-charcoal">Campus Menu</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-primary-700">
                {menu.length} items
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Freshly prepared meals, snacks, and refreshing drinks
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-charcoal hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Food Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map((item) => (
            <MenuCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              category={item.category}
              available={item.available}
              caloriesPer100g={item.caloriesPer100g}
              weightG={item.weightG}
              description={item.description}
              image={item.image}
              onAddToOrder={addItem}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
