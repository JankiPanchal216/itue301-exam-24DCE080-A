const mongoose = require("mongoose");
const connect = require("./db");
const MenuItem = require("./models/MenuItem");
const { formatValidationError } = require("./utils/formatError");

(async () => {
  try {
    await connect();

    // Save one valid menu item
    const validItem = new MenuItem({
      name: "Samosa",
      price: 15,
      category: "snack",
      available: true,
      caloriesPer100g: 260,
      weightG: 60,
    });
    const saved = await validItem.save();
    console.log("Saved valid menu item:", saved._id ? saved.name : saved);

    // Attempt to save one invalid menu item to demonstrate validation error reporting
    try {
      const invalidItem = new MenuItem({
        name: "Mega Oversized Cold Coffee",
        price: -25,
        category: "drink",
        caloriesPer100g: 1200,
        weightG: 750, // drinks cannot exceed 500g
      });
      await invalidItem.save();
    } catch (err) {
      console.log("Formatted validation error for invalid item:");
      console.log(JSON.stringify(formatValidationError(err), null, 2));
    }
  } catch (err) {
    console.error("Database error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
})();
