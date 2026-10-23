# FINDINGS — Campus Canteen Pre-Order (ITUE301 Set A)

This document details all bugs and incomplete functionality identified in the starter kit, why they violated the practical examination specifications, and how each issue was resolved.

---

## Quick Reference Summary Table

| Task | Where (file / line) | Why it stopped the rules being met | How I fixed it |
|---|---|---|---|
| **T1 — Menu** | `frontend/src/utils/nutrition.js:2` | Missing default fallback for `weightG` caused `kcal` to compute `NaN` for items lacking weight (e.g. Cold Coffee). | Updated `weightOf(item)` to return `item.weightG ?? 100`. |
| **T1 — Menu** | `frontend/src/pages/MenuPage.jsx:9` | `.map()` lacked a unique `key` prop, causing React console warnings. Passed props (`title`, `cost`) did not match `MenuCard` expectations. | Added `key={item.id}` and passed standardized item props (`name`, `price`, `caloriesPer100g`, `weightG`). |
| **T1 — Menu** | `frontend/src/components/MenuCard.jsx:1-9` | Card did not display portion weight, energy in kcal, or an Add to Order button. | Added portion weight (`{portionWeight} g`), energy (`{energyKcal} kcal`), and an Add to Order button disabled when unavailable. |
| **T2 — Order** | `frontend/src/components/NavBar.jsx:4-6` | Used standard `<a href="...">` anchors which triggered full-page browser reloads instead of SPA client routing. | Replaced `<a>` with React Router `NavLink`/`Link` components. |
| **T2 — Order** | `frontend/src/pages/OrderPage.jsx:9-10` | Direct array mutation (`cart.push(item); setCart(cart)`) reused the same reference, preventing reliable React re-renders. | Used immutable state update `setCart(prev => [...prev, item])`. |
| **T2 — Order** | `frontend/src/pages/OrderPage.jsx:16` | `<input>` for student name had `value={name}` with no `onChange` handler, making typing impossible. | Added `onChange={(e) => setStudentName(e.target.value)}`. |
| **T2 — Order** | `frontend/src/pages/OrderPage.jsx:23-28` | Cart removal button was missing; total price and total calories were omitted; 1000 kcal restriction was not enforced. | Added line removal, derived totals (`itemCount`, `totalPrice`, `totalKcal`), 1000 kcal check showing exact error message, and a calorie progress bar. |
| **T3 — Specials** | `frontend/src/pages/SpecialsPage.jsx:10` | `useEffect` lacked a dependency array (`[]`), triggering endless duplicate network fetches on every re-render. | Added dependency array and `useCallback` with `AbortController` cleanup for request isolation. |
| **T3 — Specials** | `frontend/src/pages/SpecialsPage.jsx:11-18` | `res.ok` status was not validated; non-2xx HTTP responses and network errors left the component in an indeterminate loading state without retry. | Added `if (!res.ok) throw new Error(...)`, `setLoading(false)` in error handler, and an interactive Retry button. |
| **T3 — Specials** | `frontend/src/pages/SpecialsPage.jsx:27-30` | Available specials were not sorted first; available count (`<n> of <total> available`) was absent. | Implemented stable available-first sorting and added `<n> of <total> available` banner. |
| **T4 — Orders API** | `backend/app.js:5-7` | Request logger did not call `next()`, causing all incoming HTTP requests to hang indefinitely. | Added `next()` invocation inside the logger middleware. |
| **T4 — Orders API** | `backend/app.js:42` | `app.use(express.json())` was mounted *after* the route definitions, leaving `req.body` undefined in `POST /api/v1/orders`. | Moved `app.use(express.json())` to the top before all route handlers. |
| **T4 — Orders API** | `backend/app.js:28-33` | `POST /api/v1/orders` lacked validation for menu item, quantity (1–10 whole number), and positive weight, and did not calculate `kcal`. | Added full validation returning HTTP 400 `{ error: "..." }`, applied defaults (`qty: 1`, `weightG: 100`), and computed `kcal = Math.round(kcal100 * weightG / 100 * qty)`. |
| **T4 — Orders API** | `backend/app.js:35` | `DELETE /api/v1/orders/:id` endpoint was completely missing. | Implemented `DELETE /api/v1/orders/:id` returning 200 on success and 404 `{ error: "Order not found" }` when nonexistent. |
| **T4 — Orders API** | `backend/app.js:45-48` | Error middleware had only 3 arguments `(err, req, res)` instead of 4, and leaked `err.stack` in the response JSON. | Corrected signature to `(err, req, res, next)` and returned HTTP 500 `{ error: "Something went wrong" }` with zero stack traces. |
| **T5 — MongoDB** | `backend/models/MenuItem.js:5` | `price` validation used `max: 0` instead of `min: 0`, rejecting valid prices and allowing negative numbers. | Changed validator to `min: [0, "price cannot be negative"]`. |
| **T5 — MongoDB** | `backend/models/MenuItem.js:6` | Category default was set to `"Snack"` (capitalized), failing enum validation `["snack", "meal", "drink"]`. | Changed default to lowercase `"snack"`. |
| **T5 — MongoDB** | `backend/models/MenuItem.js:15` | Drink portion weight validator used `v >= 500` instead of `v <= 500`, rejecting valid drink weights below 500g. | Corrected validator comparison to `v <= 500`. |
| **T5 — MongoDB** | `backend/utils/formatError.js:3-5` | `formatValidationError(err)` returned raw `err` instead of clean `{ error: "Validation failed", details: [...] }`. | Formatted Mongoose errors into `{ error: "Validation failed", details: [{ field, message }] }`. |
| **T5 — MongoDB** | `backend/seed.js:8` | Seed script was empty and did not save valid records, report invalid records, or disconnect cleanly. | Implemented database seed to save 1 valid item, log formatted error for 1 invalid item, and close Mongoose connection. |

---

## Detailed Viva Explanations

### T1 — Menu (Components and Props)
- **What was wrong:**
  1. In `frontend/src/utils/nutrition.js`, `weightOf(item)` returned `item.weightG` directly without a fallback. When an item had no `weightG` defined (such as `Cold Coffee` in `menu.js`), `kcal(item)` calculated `NaN`.
  2. In `frontend/src/pages/MenuPage.jsx`, the `.map()` loop rendering menu cards did not provide a unique `key` prop, causing a React console warning. Furthermore, props passed (`title`, `cost`) did not match the expected props in `MenuCard.jsx`.
  3. `frontend/src/components/MenuCard.jsx` omitted portion weight in grams, energy in kcal, and an Add to Order button.
- **Why it mattered:**
  Items with unspecified portion sizes displayed broken nutrition values (`NaN kcal`), the browser raised console warnings violating exam rules, and users had no way to inspect portion weight or add food to their order.
- **How I fixed it:**
  - In `nutrition.js`, implemented `weightG ?? 100` fallback and the formula `Math.round((caloriesPer100g * portionWeight) / 100)`.
  - In `MenuPage.jsx`, added `key={item.id}` and passed standardized item props.
  - In `MenuCard.jsx`, displayed portion weight (`{portionWeight} g`), energy (`{energyKcal} kcal`), price formatted with `₹` and two decimals (`toFixed(2)`), and an accessible "Add to Order" button (enabled for available items, disabled for unavailable items).
- **Files modified:**
  - `frontend/src/utils/nutrition.js`
  - `frontend/src/pages/MenuPage.jsx`
  - `frontend/src/components/MenuCard.jsx`

---

### T2 — Order (Routing and State)
- **What was wrong:**
  1. Navigation in `NavBar.jsx` used regular anchor tags (`<a href="...">`), causing full page reloads and resetting client state on navigation.
  2. In `OrderPage.jsx`, `addItem` directly mutated state via `cart.push(item); setCart(cart)`. Because the array reference remained identical, React could skip re-renders.
  3. The student name input had `value={name}` but no `onChange` handler, making user input impossible.
  4. Cart removal functionality was completely missing.
  5. Total items, total price, and total calories were not calculated or displayed together.
  6. The 1000 kcal limit check was missing, allowing orders to exceed healthy campus limits without warning.
- **Why it mattered:**
  Students could not enter their name, state updates failed to trigger UI re-renders, navigating between tabs wiped out cart progress, and orders could exceed the examination calorie quota.
- **How I fixed it:**
  - Created a shared `CartContext` using React Context with immutable updates (`setCart(prev => [...prev, newItem])`).
  - Switched `NavBar.jsx` to React Router `NavLink`/`Link` components for smooth SPA transitions.
  - Added `onChange={(e) => setStudentName(e.target.value)}` and displayed `"Order for: <name>"`.
  - Implemented immutable cart line removal via `removeItem(cartLineId)`.
  - Derived `itemCount`, `totalPrice`, and `totalKcal` directly from the cart array on every render without storing redundant copies in state.
  - Added prospective calorie calculation before item addition; if `totalKcal + itemKcal > 1000`, item is rejected and the exact message `"Calorie limit of 1000 kcal exceeded"` is displayed alongside a visual progress bar.
- **Files modified:**
  - `frontend/src/context/CartContext.jsx`
  - `frontend/src/components/NavBar.jsx`
  - `frontend/src/pages/OrderPage.jsx`
  - `frontend/src/App.jsx`

---

### T3 — Specials Board (API Consumption)
- **What was wrong:**
  1. `SpecialsPage.jsx` had a `useEffect` hook without a dependency array (`[]`), causing fetch requests to repeat infinitely on every component render.
  2. The fetch callback did not check `res.ok`, allowing non-2xx HTTP responses to be treated as successful.
  3. The `.catch()` block did not set `loading` to `false`, leaving the screen stuck on "Loading specials…".
  4. No Retry button was provided to recover from failures without a full page refresh.
  5. The specials were not sorted to show available items first.
  6. The required availability count banner (`<n> of <total> available`) was missing.
- **Why it mattered:**
  Infinite network requests spam external endpoints and degrade browser performance. Network or server errors resulted in permanently frozen loading states, and students could not see which daily specials were currently available.
- **How I fixed it:**
  - Wrapped request in `useCallback` with `useEffect(() => { fetchSpecials(); return () => controller.abort(); }, [fetchSpecials])` and an `AbortController` to guarantee exactly one initial fetch.
  - Checked `if (!res.ok) throw new Error(...)` and set `loading: false` in `.catch()` to display `"Could not load specials"` with an in-page `Retry` button.
  - Displayed `"Loading specials…"` during pending fetch.
  - Computed `availableCount` where `completed === false`.
  - Implemented stable sorting `[...data].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))` to prioritize available specials while preserving original API order.
  - Added banner displaying `"<n> of <total> available"`.
- **Files modified:**
  - `frontend/src/pages/SpecialsPage.jsx`

---

### T4 — Orders Service (Express and Middleware)
- **What was wrong:**
  1. In `backend/app.js`, the request logger middleware logged `[METHOD] [PATH] [TIMESTAMP]` but failed to call `next()`, causing every HTTP request to hang until timeout.
  2. `app.use(express.json())` was placed after the route handlers, leaving `req.body` as `undefined` for `POST /api/v1/orders`.
  3. `POST /api/v1/orders` lacked input validation for `itemName` (must be in `MENU`), `qty` (must be whole number 1–10, default 1), and `weightG` (must be number > 0, default 100), and did not calculate `kcal`.
  4. The `DELETE /api/v1/orders/:id` endpoint was completely missing.
  5. The global error handler had only 3 parameters `(err, req, res)`, which Express does not recognize as error-handling middleware, and exposed internal error messages and `err.stack` in JSON responses.
- **Why it mattered:**
  All backend routes timed out in automated tests. Orders could not be submitted with JSON bodies, invalid orders were accepted, and unhandled errors leaked sensitive stack trace details.
- **How I fixed it:**
  - Added `next()` call to the logger middleware.
  - Moved `app.use(express.json())` above all route definitions.
  - Added thorough validation to `POST /api/v1/orders` returning HTTP 400 `{ error: "..." }` for invalid inputs, defaulting `qty` to 1 and `weightG` to 100, and calculating `kcal = Math.round((caloriesPer100g * weightG / 100) * qty)`.
  - Implemented `DELETE /api/v1/orders/:id` returning 200 on successful deletion and 404 `{ error: "Order not found" }` if absent.
  - Updated global error handler to 4 arguments `(err, req, res, next)` returning HTTP 500 `{ error: "Something went wrong" }` with zero stack traces leaked.
- **Files modified:**
  - `backend/app.js`

---

### T5 — The Menu Data (MongoDB and Mongoose)
- **What was wrong:**
  1. In `backend/models/MenuItem.js`, `price` validation used `max: [0, ...]` instead of `min: [0, ...]`. This accepted negative numbers (e.g. -10) and rejected positive prices.
  2. The `category` default was set to `"Snack"` with a capital S, which failed Mongoose's lowercase enum `["snack", "meal", "drink"]`.
  3. The drink weight custom validator had `v >= 500` instead of `v <= 500`, which erroneously allowed oversized drinks and blocked standard drinks under 500g.
  4. `backend/utils/formatError.js` returned the raw Mongoose error object rather than a sanitized plain object.
  5. `backend/seed.js` was incomplete and did not save valid records, demonstrate error formatting, or close the connection.
- **Why it mattered:**
  Valid items could not be saved to MongoDB due to schema rejection, invalid drinks were allowed, and error payloads exposed Mongoose internal structures to API consumers.
- **How I fixed it:**
  - In `MenuItem.js`, corrected `price: { min: [0, "price cannot be negative"] }`, `category: { default: "snack" }`, and custom validator `v <= 500` for drinks.
  - In `formatError.js`, transformed Mongoose `ValidationError` into clean `{ error: "Validation failed", details: [ { field, message } ] }`.
  - In `seed.js`, implemented script to connect to MongoDB, save 1 valid item ("Samosa"), attempt to save 1 invalid item (price < 0, drink weight > 500), log the formatted error, and close the database connection.
- **Files modified:**
  - `backend/models/MenuItem.js`
  - `backend/utils/formatError.js`
  - `backend/seed.js`
