import { Inter } from "next/font/google";
import localFont from 'next/font/local'

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const sfPro = localFont({
  src: [
    {
      path: "../../public/sf-pro-text-regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/sf-pro-text-medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/sf-pro-text-semibold.woff",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});
