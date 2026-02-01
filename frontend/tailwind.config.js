/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#00b0f0", // Cyan for CODELANCE
        "primary-dark": "#0ea673",
        "navy-deep": "#002B49",
        "background-light": "#f5f8f8",
        "background-dark": "#0f1e23",
        "text-main": "#111816",
        "text-main-dark": "#ffffff",
        "text-secondary": "#61897c",
        "text-secondary-dark": "#a3c2b8",
        "text-muted": "#637588",
        "surface-light": "#ffffff",
        "surface-dark": "#183028",
        "card-dark": "#152a24",
        "card-light": "#FFFFFF",
        "text-light": "#1F2937",
        "text-dark": "#F9FAFB",
      },
      fontFamily: {
        "display": ["Manrope", "Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px",
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
