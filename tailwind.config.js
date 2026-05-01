module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#178bf1",
        },
        cBlue: {
          DEFAULT: "#087FFD",
          100: "#265098",
          200: "#178bf1",
        },
        cDarkBlue: "#265098",
        cRed: { DEFAULT: "#C60E0E", 100: "#da1e28" },
        cGreen: {
          DEFAULT: "#07A920",
          100: "#23ce6b",
        },
        cDarkGreen: "#2E9390",
        cDarkPurple: "#6C2E93",
        cGray: {
          DEFAULT: "#F0F0F0",
          100: "#F1F1F1",
          200: "#DDDDDD",
          300: "#f9f9f9",
          400: "#f7f7f7",
          500: "#ececec",
          600: "#c5c5c5",
        },
      },
    },
    fontFamily: {
      sans: ["Montserrat", "ui-sans-serif", "system-ui"],
    },
  },
  plugins: [],
};
