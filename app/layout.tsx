import type { Metadata } from "next";
import "./globals.css";
import { inter, sfPro } from "@/components/ui/fonts";
import Themewrapper from "./themewrapper";

export const metadata: Metadata = {
  title: "Drag and Drop Task App",
  description: "Built by BlessTheBoy",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sfPro.variable} ${inter.className} antialiased relative h-screen overflow-hidden`}
      >
        <Themewrapper>{children}</Themewrapper>
        <div className="hidden md:block">{modal}</div>
      </body>
    </html>
  );
}
