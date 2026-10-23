import { createContext, useContext, useState } from "react";
import { kcal } from "../utils/nutrition";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [calorieError, setCalorieError] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Derived totals - NEVER stored in separate state
  const itemCount = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalKcal = cart.reduce((sum, item) => sum + kcal(item), 0);
  const remainingKcal = Math.max(0, 1000 - totalKcal);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addItem = (item) => {
    if (!item.available) {
      showToast(`${item.name} is currently not available`, "error");
      return false;
    }

    const itemKcal = kcal(item);
    const prospectiveKcal = totalKcal + itemKcal;

    if (prospectiveKcal > 1000) {
      setCalorieError("Calorie limit of 1000 kcal exceeded");
      showToast("Calorie limit of 1000 kcal exceeded", "error");
      return false;
    }

    setCalorieError("");
    setCart((prevCart) => [...prevCart, { ...item, cartLineId: `${item.id}-${Date.now()}-${Math.random()}` }]);
    showToast(`Added ${item.name} to order!`, "success");
    return true;
  };

  const removeItem = (lineIdOrIndex) => {
    setCart((prevCart) => {
      if (typeof lineIdOrIndex === "number") {
        return prevCart.filter((_, idx) => idx !== lineIdOrIndex);
      }
      return prevCart.filter((item) => item.cartLineId !== lineIdOrIndex);
    });
    setCalorieError("");
  };

  const clearCart = () => {
    setCart([]);
    setCalorieError("");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
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
        setCalorieError,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
