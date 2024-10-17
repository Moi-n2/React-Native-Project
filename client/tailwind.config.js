/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Prata: ["Prata", "sans-serif"],
        OutFitBlack: ["OutFitBlack", "sans-serif"],
        OutfitRegular: ["OutfitRegular", "sans-serif"],
        OutfitBold: ["OutfitBold", "sans-serif"],
        OutfitExtraBold: ["OutfitExtraBold", "sans-serif"],
        OutfitExtraLight: ["OutfitExtraLight", "sans-serif"],
        OutfitLight: ["OutfitLight", "sans-serif"],
        OutfitMedium: ["OutfitMedium", "sans-serif"],
        OutfitThin: ["OutfitThin", "sans-serif"],
      },
    },
  },
  plugins: [],
};
