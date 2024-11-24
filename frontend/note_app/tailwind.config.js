// tailwind.config.js
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    keyframes: {
      slideInRight: {
        "0%": { transform: "translateX(-100%)", opacity: 0 },
        "100%": { transform: "translateX(0)", opacity: 1 },
      },
      slideInLeft: {
        "0%": { transform: "translateX(100%)", opacity: 0 },
        "100%": { transform: "translateX(0)", opacity: 1 },
      },
    },
    animation: {
      slideInRight: "slideInRight 0.3s ease-in-out forwards",
      slideInLeft: "slideInLeft 0.3s ease-in-out forwards",
    },
  },
};
export const plugins = [];
