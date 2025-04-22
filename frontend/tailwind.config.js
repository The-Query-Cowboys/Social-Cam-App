/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  safelist: [
    // Pink Red
    { pattern: /bg-pinkRed-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /text-pinkRed-(50|100|200|300|400|500|600|700|800|900|950)/ },
    // Neon Green
    { pattern: /bg-neonGreen-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /text-neonGreen-(50|100|200|300|400|500|600|700|800|900|950)/ },
    // Deep Blue
    { pattern: /bg-deepBlue-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /text-deepBlue-(50|100|200|300|400|500|600|700|800|900|950)/ },
  ],
  theme: {
    extend: {
      colors: {
        background: {
          //Background
          light: "#cbd3ea",
          dark: "#101820",
        },
        foreground: {
          //Header Text
          light: "#1f2937",
          dark: "#f65275",
        },
        primary: {
          light: "#1f2937",
          dark: "#f65275",
        },
        secondary: {
          light: "#4ECDC4",
          dark: "#aadb1e",
        },
        text: {
          light: "#333333",
          dark: "#ffffff",
        },
        surface: {
          light: "#eedaea",
          dark: "#151f6d",
        },
        accent: {
          light: "#FF9F1C",
          dark: "#aadb1e",
        },
        border: {
          light: "#d1d5db",
          dark: "#aadb1e",
        },
        pinkRed: {
          50: "#FDD3E2",
          100: "#FDC9DB",
          200: "#FCB1CB",
          300: "#FB93B7",
          400: "#F9679A",
          500: "#F50A5D",
          600: "#DD0953",
          700: "#BF0848",
          800: "#A2073D",
          900: "#76052C",
          950: "#53031F",
        },
        neonGreen: {
          50: "#EAFADB",
          100: "#E4F8CE",
          200: "#D5F3AA",
          300: "#C4ED7D",
          400: "#B2E543",
          500: "#AADB1E",
          600: "#8FC51B",
          700: "#7BB319",
          800: "#5F9414",
          900: "#406C0F",
          950: "#2A4C0A",
        },
        deepBlue: {
          50: "#EFEEFC",
          100: "#E1E1F9",
          200: "#C7C8F4",
          300: "#A5A9EE",
          400: "#7A83E6",
          500: "#293DD6",
          600: "#2734C9",
          700: "#2229AF",
          800: "#1B1D8D",
          900: "#181674",
          950: "#120F4D",
        },
      },
      spacing: {
        '80': '20rem',
        '100': '25rem',
        '120': '30rem'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
