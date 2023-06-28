/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "tron-gold": "#CFB23C",
        "tron-green": "#0E6707",
      },
    },
  },
  plugins: [],
};
