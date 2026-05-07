import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18201d",
        moss: "#4d6b57",
        linen: "#f5f2ec",
        signal: "#d96f32",
        ocean: "#2f6f8f"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(24, 32, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
