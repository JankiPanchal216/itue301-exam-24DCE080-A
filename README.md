# CampusBite — Campus Canteen Pre-Order Application
### ITUE301 Advanced Web Development Frameworks • Practical Examination (Set A)

CampusBite is a modern, responsive Campus Canteen Pre-Order application built with **React (Vite)**, **Tailwind CSS**, **Node.js (Express)**, and **MongoDB (Mongoose)**.

---

## Tech Stack
- **Frontend:** React 18, Vite 5, Tailwind CSS, Lucide React, React Router DOM v6
- **Backend:** Node.js, Express.js 4
- **Database:** MongoDB, Mongoose 8
- **Testing:** Node.js native test runner (`node --test`)

---

## Getting Started

### 1. Backend Setup & Tests
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run automated tests (17 passing unit/integration tests)
npm test

# Start the Express API server (runs on http://localhost:5000)
npm start
```

### 2. Frontend Setup & Run
```bash
# Navigate to frontend (in a separate terminal)
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# App will run at http://localhost:5173

# Build for production
npm run build
```

### 3. Database Seeding & Evidence
1. Copy `backend/.env.example` to `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Set your MongoDB connection string in `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_canteen?retryWrites=true&w=majority
   # or for local MongoDB:
   # MONGO_URI=mongodb://127.0.0.1:27017/campus_canteen
   ```
3. Run the seed script:
   ```bash
   cd backend
   npm run seed
   ```
4. Capture a screenshot of the saved document in MongoDB Compass or MongoDB Atlas and place it at:
   `evidence/db.png`

---

## Five Exam Tasks Completed

| Task | Description | Status |
|---|---|---|
| **Task 1 — Menu** | Portion weights, kcal calculation `round(kcal/100g * weightG / 100)` with fallback 100g, price formatted to ₹ with 2 decimals, availability badges, zero React warnings. | Complete |
| **Task 2 — Order** | Client routing with React Router, reactive student name display `"Order for: <name>"`, immutable cart updates, item removals, derived totals, strict 1000 kcal limit with `"Calorie limit of 1000 kcal exceeded"` message, and calorie progress bar. | Complete |
| **Task 3 — Specials** | Single initial fetch from JSONPlaceholder, `"Loading specials…"` state, available-first stable sorting, `"<n> of <total> available"` counter, non-2xx / network error handling with `"Could not load specials"` and in-page Retry button. | Complete |
| **Task 4 — Orders API** | Request logger with `next()`, `express.json()` before routes, `POST /api/v1/orders` validation (menu item, 1-10 qty, positive weight) & kcal calculation, `DELETE /api/v1/orders/:id`, and centralized 4-parameter error handler returning 500 without stack leakage. | Complete |
| **Task 5 — MongoDB** | `MenuItem` schema constraints (min price 0, category lowercase enum with default `"snack"`, calories 0-900, drink weight max 500g), `formatValidationError` plain object response, and `seed.js` script with connection cleanup. | Complete |

---

## Project Structure
```text
ITUE301/
├── backend/
│   ├── models/
│   │   └── MenuItem.js          # Mongoose schema with custom drink weight validation
│   ├── test/
│   │   ├── api.test.js          # Express API route tests
│   │   └── model.test.js        # Mongoose schema & validation error tests
│   ├── utils/
│   │   └── formatError.js       # Formats Mongoose errors into clean client objects
│   ├── .env.example             # Template for MongoDB URI
│   ├── app.js                   # Express application and route handlers
│   ├── db.js                    # Database connection helper
│   ├── package.json             # Backend dependencies and scripts
│   ├── seed.js                  # Database seeder demonstrating valid/invalid items
│   └── server.js                # API entrypoint on port 5000
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MenuCard.jsx     # Food item card with nutrition & availability
│   │   │   └── NavBar.jsx       # Responsive header with live badge & routing
│   │   ├── context/
│   │   │   └── CartContext.jsx  # Shared state, derived totals & 1000 kcal quota
│   │   ├── data/
│   │   │   └── menu.js          # Canteen menu items
│   │   ├── pages/
│   │   │   ├── MenuPage.jsx     # Hero section, category filters & menu grid
│   │   │   ├── OrderPage.jsx    # Cart list, student name, calorie meter & summary
│   │   │   └── SpecialsPage.jsx # Specials board with sorting, error & retry
│   │   ├── utils/
│   │   │   └── nutrition.js     # Weight fallback and kcal calculations
│   │   ├── App.jsx              # Main router and app layout
│   │   ├── index.css            # Tailwind directives and custom styling
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html               # HTML wrapper with Plus Jakarta Sans & Inter
│   ├── package.json             # Frontend dependencies and scripts
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tailwind.config.js       # Tailwind theme colors and styles
│   └── vite.config.js           # Vite build configuration
├── evidence/
│   └── db.png                   # MongoDB Compass / Atlas screenshot location
├── FINDINGS.md                  # Detailed task-by-task viva documentation
├── README.md                    # Setup and execution guide
└── SET-A Exam Paper.pdf         # Practical exam problem statement
```
