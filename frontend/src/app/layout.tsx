import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Herbes Jabal Toubkal | High Atlas Premium Spices",
  description: "Discover authentic Moroccan spices and aromatic herbs from the high Atlas Mountains. Pure, natural, and hand-selected treasures from Jabal Toubkal since 2025.",
  keywords: ["Moroccan spices", "Jabal Toubkal", "Atlas Mountains", "organic herbs", "premium spices"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable}`} suppressHydrationWarning={true}>
      <body className={`${outfit.className} antialiased selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
