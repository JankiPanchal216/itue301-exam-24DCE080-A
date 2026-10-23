const express = require("express");
const app = express();

// Middleware: parse JSON request bodies before route handlers
app.use(express.json());

// Request logger: [METHOD] [PATH] [TIMESTAMP]
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} [${new Date().toISOString()}]`);
  next();
});

// Energy content (kcal per 100 g) of every item the canteen serves
const MENU = { "Samosa": 260, "Masala Chai": 50, "Veg Thali": 150, "Cold Coffee": 70 };

let orders = [
  { id: 1, itemName: "Samosa", qty: 2, weightG: 60, kcal: 312 },
  { id: 2, itemName: "Masala Chai", qty: 1, weightG: 150, kcal: 75 },
];
let nextId = 3;

app.get("/api/v1/orders", (req, res) => {
  res.status(200).json(orders);
});

app.get("/api/v1/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.status(200).json(order);
});

app.post("/api/v1/orders", (req, res) => {
  const { itemName } = req.body || {};
  let { qty, weightG } = req.body || {};

  // Validate itemName
  if (!itemName || !(itemName in MENU)) {
    return res.status(400).json({ error: "Invalid or unsupported menu item" });
  }

  // Validate and default qty (whole number 1 to 10, default 1)
  if (qty === undefined) {
    qty = 1;
  } else if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return res.status(400).json({ error: "qty must be a whole number between 1 and 10" });
  }

  // Validate and default weightG (number > 0, default 100)
  if (weightG === undefined) {
    weightG = 100;
  } else if (typeof weightG !== "number" || isNaN(weightG) || weightG <= 0) {
    return res.status(400).json({ error: "weightG must be a number greater than 0" });
  }

  // Calculate kcal: round(kcal per 100 g * weightG / 100 * qty)
  const caloriesPer100g = MENU[itemName];
  const kcal = Math.round((caloriesPer100g * weightG / 100) * qty);

  const order = { id: nextId++, itemName, qty, weightG, kcal };
  orders.push(order);
  res.status(201).json(order);
});

app.delete("/api/v1/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  const deleted = orders.splice(index, 1)[0];
  res.status(200).json({ message: "Order deleted successfully", order: deleted });
});

// Diagnostic route used to test the error handler. Leave it in place.
app.get("/api/v1/boom", () => {
  throw new Error("Kitchen is on fire");
});

// Global centralized error handler: 4 parameters required for Express error middleware
app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
