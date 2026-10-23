/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F97316",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
        charcoal: {
          DEFAULT: "#18181B",
          50: "#FAFAFA",
          100: "#F4F4F5",
          800: "#27272A",
          900: "#18181B",
        },
        cream: "#FAFAF9",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(24, 24, 27, 0.05), 0 2px 6px -1px rgba(24, 24, 27, 0.03)",
        "card-hover": "0 12px 30px -4px rgba(249, 115, 22, 0.12), 0 6px 14px -2px rgba(24, 24, 27, 0.06)",
        dropdown: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        'card': '18px',
      }
    },
  },
  plugins: [],
}
