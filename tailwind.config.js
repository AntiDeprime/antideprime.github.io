module.exports = {
  content: ["./template.html", "./theme.js"],
  darkMode: "class",
  safelist: [
    "max-w-[28rem]",
    "w-36",
    "h-36",
    "sm:w-40",
    "sm:h-40",
    "p-8",
    "sm:p-10",
    "gap-7",
    "sm:gap-8",
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
};
