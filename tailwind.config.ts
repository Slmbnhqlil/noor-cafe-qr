import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F1E8",
        coffee: {
          50: "#FAF6F0",
          100: "#EFE5D5",
          200: "#D9C4A3",
          300: "#B89870",
          400: "#9A7A52",
          500: "#7A5B3A",
          600: "#5C4228",
          700: "#3F2C1A",
          800: "#2A1D11",
          900: "#1A1109"
        },
        gold: "#C9A86A"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(60,40,20,0.15)"
      }
    }
  },
  plugins: []
};
export default config;
