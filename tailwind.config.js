/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf6f1",
          100: "#f0e6d8",
          200: "#e0ccb0",
          300: "#d4a574",
          400: "#c4884a",
          500: "#6F4E37",
          600: "#5C3D2E",
          700: "#4A2F23",
          800: "#3A2419",
          900: "#2C1810",
        },
      },
    },
  },
  plugins: [],
};