import type { Config } from "tailwindcss";
import { colors, darkColors } from "./components/ui/colors";
import { text } from "stream/consumers";

const config = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
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
        gray_1: colors.gray[1],
        gray_2: colors.gray[2],
        gray_3: colors.gray[3],
        gray_4: colors.gray[4],
        gray_5: colors.gray[5],
        gray_6: colors.gray[6],
        gray_7: colors.gray[7],
        gray_8: colors.gray[8],
        gray_9: colors.gray[9],
        shadow: colors.shadow,
        success: colors.success,
        success_bg: colors.success_bg,
        error: colors.error,
        error_bg: colors.error_bg,
        medium: colors.medium,
        medium_bg: colors.medium_bg,
        text_header: colors.text.header,
        text_paragraph: colors.text.paragraph,
        text_paragraph2: colors.text.paragraph2,
        danger: colors.danger,
        flagOrange: colors.flagOrange,
        // Dark mode colors
        darkWhite: darkColors.white,
        darkGray_1: darkColors.gray[1],
        darkGray_4: darkColors.gray[4],
        darkGray_5: darkColors.gray[5],
        darkGray_6: darkColors.gray[6],
        darkGray_8: darkColors.gray[8],
        darkText_header: darkColors.text.header,
        darkText_paragraph: darkColors.text.paragraph,
      },
      boxShadow: {
        card: "0 3px 2px -2px rgba(0,0,0,0.06), 0 5px 3px -2px rgba(0,0,0,0.02)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
