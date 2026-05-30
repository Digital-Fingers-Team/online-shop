import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eef8ff", 100: "#d8efff", 500: "#0ea5e9", 600: "#0284c7", 900: "#0c4a6e" }
      },
      boxShadow: { soft: "0 20px 50px -20px rgb(15 23 42 / 0.25)" }
    }
  },
  plugins: []
};
export default config;
