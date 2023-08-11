/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
      colors: {
        colorPrimary: "#ffdd95",
        colorPrimaryLight: "#ffe4aa",
        colorBg: "#242428",
        colorDark1: "#43474f",
        colorSecondary: "#222228",
        colorSecondary2: "#222228",
        colorText: "rgba(255,255,241)",
        colorError: "rgba(244,63,94)",
      },
    },

    screens: {
      "2xl": { max: "1200px" },
      xl: { max: "1000px" },
      lg: { max: "750px" },
      md: { max: "650px" },
      sm: { max: "500px" },
      xs: { max: "320px" },
      "3xl": "1800px",
    },
  },
  plugins: [],
};
