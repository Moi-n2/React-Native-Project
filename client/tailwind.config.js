/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Prata: ["Prata", "sans-serif"],
        OutFitBlack: ["OutFitBlack", "sans-serif"],
        OutfitRegular: ["OutfitRegular", "sans-serif"],
        // JakartaExtraLight: ["Jakarta-ExtraLight", "sans-serif"],
        // JakartaLight: ["Jakarta-Light", "sans-serif"],
        // JakartaMedium: ["Jakarta-Medium", "sans-serif"],
        // JakartaSemiBold: ["Jakarta-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
