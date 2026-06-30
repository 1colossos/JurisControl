/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0e1a36",
          800: "#13213f",
          700: "#1b2c52",
          600: "#243a66",
        },
        ink: "#16213e",
        gold: {
          DEFAULT: "#e0a83a",
          600: "#d3982a",
          soft: "#f4d79b",
          bg: "#fbf3df",
        },
        canvas: "#f4f6fa",
        surface: "#ffffff",
        line: "#e6e9f1",
        "line-2": "#dde2ec",
        body: "#1f2937",
        "body-2": "#475467",
        muted: "#8a93a6",
        critico: { DEFAULT: "#e0413a", bg: "#fdecec" },
        alto: { DEFAULT: "#d3982a", bg: "#fbf2dd" },
        medio: { DEFAULT: "#3b5bdb", bg: "#e9edfb" },
        baixo: { DEFAULT: "#1f9d57", bg: "#e6f6ec" },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "Menlo", "Consolas", "monospace"],
      },
      borderRadius: { xl: "16px", "2xl": "22px" },
      boxShadow: {
        soft: "0 4px 16px rgba(16,24,40,.06)",
        lift: "0 18px 48px rgba(16,24,40,.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up .4s ease both" },
    },
  },
  plugins: [],
};
