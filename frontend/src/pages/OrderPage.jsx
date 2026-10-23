import { Trash2, ShoppingBag, Plus, AlertCircle, ArrowLeft, Check, Flame, CreditCard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { menu } from "../data/menu";
import { kcal } from "../utils/nutrition";

export default function OrderPage() {
  const {
    cart,
    studentName,
    setStudentName,
    addItem,
    removeItem,
    clearCart,
    itemCount,
    totalPrice,
    totalKcal,
    remainingKcal,
    calorieError,
  } = useCart();

  // Progress percentage capped at 100%
  const caloriePercentage = Math.min(100, Math.round((totalKcal / 1000) * 100));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[calc(100vh-80px)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <Link to="/" className="hover:text-primary-600 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
            </Link>
            <span>/</span>
            <span className="text-charcoal">Checkout</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">
            Review Your Order
          </h1>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="self-start sm:self-auto text-xs font-semibold text-gray-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-rose-200 bg-white shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left = Items & Details, Right = Summary & Calories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Student Info Card */}
          <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card">
            <h2 className="text-base font-bold text-charcoal mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-primary-600 flex items-center justify-center text-xs font-bold">1</span>
              <span>Student Information</span>
            </h2>
            <div className="space-y-3">
              <label htmlFor="student-name-input" className="block text-xs font-semibold text-gray-600">
                Student Full Name
              </label>
              <input
                id="student-name-input"
                type="text"
                placeholder="Enter your name (e.g. Alex Sharma)"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
              />
              {/* Exam Requirement: "Order for: <name>" */}
              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Active Order Tag:</span>
                <p id="order-for-text" className="text-sm font-bold text-primary-700">
                  Order for: {studentName || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Calorie Limit Alert message */}
          {calorieError && (
            <div
              id="calorie-error-alert"
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 shadow-sm animate-shake"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">{calorieError}</p>
                <p className="text-xs text-rose-600 mt-0.5">
                  Pre-orders are strictly restricted to 1000 kcal to maintain healthy campus portion sizes. Please remove an item to add this selection.
                </p>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-primary-600 flex items-center justify-center text-xs font-bold">2</span>
                <span>Cart Items ({itemCount})</span>
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-charcoal mb-1">Your cart is currently empty</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                  Browse our canteen menu or use the quick-add shelf below to pick your favorite meals!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Browse Campus Menu</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.map((item, index) => {
                  const itemKcal = kcal(item);
                  return (
                    <div
                      key={item.cartLineId || index}
                      className="py-3.5 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-primary-600 shrink-0 font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-charcoal">{item.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="capitalize">{item.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-orange-600 font-semibold">
                              <Flame className="w-3 h-3" />
                              {itemKcal} kcal
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Price formatted with ₹ and two decimals */}
                        <span className="text-sm font-extrabold text-charcoal whitespace-nowrap">
                          ₹{Number(item.price).toFixed(2)}
                        </span>
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartLineId ?? index)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove item from order"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick-Add Bar (Available Items) */}
          <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card">
            <h3 className="text-sm font-bold text-charcoal mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>Quick Add to Order</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Add more available canteen favorites in one click:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {menu
                .filter((i) => i.available)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-primary-700 border border-gray-200 hover:border-orange-200 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary-600" />
                    <span>Add {item.name}</span>
                    <span className="text-gray-400 font-normal">₹{Number(item.price).toFixed(2)}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Section: Order Summary & Calorie Progress (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Calorie Progress Card */}
          <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Calorie Intake Meter</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-charcoal">
                Max 1000 kcal
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2.5">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  totalKcal > 900
                    ? "bg-rose-500"
                    : totalKcal > 650
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${caloriePercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>{totalKcal} kcal consumed</span>
              <span className="font-bold text-charcoal">{remainingKcal} kcal remaining</span>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card">
            <h3 className="text-base font-bold text-charcoal pb-3 border-b border-gray-100 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Total Items</span>
                <span id="summary-total-items" className="font-bold text-charcoal">{itemCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Total Energy</span>
                <span id="summary-total-calories" className="font-bold text-orange-600">{totalKcal} kcal</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Calorie Allowance</span>
                <span className="font-semibold text-emerald-600">{remainingKcal} kcal left</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-charcoal block">Total Price</span>
                  <span className="text-[11px] text-gray-400">Inclusive of all campus taxes</span>
                </div>
                {/* Total price formatted with ₹ and exactly two decimals */}
                <span id="summary-total-price" className="text-2xl font-black text-primary-600">
                  ₹{Number(totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Mock Checkout Confirmation Button */}
            <div className="mt-6 pt-2">
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => {
                  alert(
                    `🎉 Order confirmed for ${studentName || "Student"}!\nTotal Items: ${itemCount}\nTotal Price: ₹${totalPrice.toFixed(
                      2
                    )}\nEnergy: ${totalKcal} kcal\nToken #CB-${Math.floor(100 + Math.random() * 900)}`
                  );
                  clearCart();
                }}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  cart.length > 0
                    ? "bg-primary-500 hover:bg-primary-600 active:scale-95 text-white shadow-orange-500/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Confirm Pre-Order (₹{Number(totalPrice).toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
