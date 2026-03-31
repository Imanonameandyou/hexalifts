import type { Metadata } from "next";
import { DM_Serif_Display, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

const barlowCond = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cond",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Hexadrine — Why do you keep falling off?",
  description:
    "6 questions. We'll tell you exactly what's getting in your way and give you the free resources to fix it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${barlowCond.variable} ${barlow.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
