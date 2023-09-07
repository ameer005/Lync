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
        colorDark2: "#181823",
        colorSecondary: "#222228",
        colorSecondary2: "#222228",
        colorText: "rgba(255,255,241)",
        colorError: "rgba(244,63,94)",
      },

      keyframes: {
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slideIn: {
          from: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
        },
      },
      animation: {
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
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
