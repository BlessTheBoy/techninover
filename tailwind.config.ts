import type { Config } from "tailwindcss";
import { colors } from "./app/ui/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        sfPro: ["var(--font-sf-pro)"],
      },
      colors: {
        purple: colors.purple,
        purple_bg: colors.purple_bg,
      },
    },
  },
  plugins: [],
};
export default config;
