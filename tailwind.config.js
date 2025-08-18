/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        // Exemplo: destaque vermelho e azul (mantendo padrão mais puro)
        red: {
          500: "#FF0000",
          600: "#CC0000",
        },
        blue: {
          500: "#007BFF",
          600: "#0056D2",
        },
      },
    },
  },
  plugins: [],
}
