import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Cairo } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: '--font-sans'
});

const serif = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: '--font-serif'
});

const arabic = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: '--font-arabic'
});

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
    <html lang="en" className={`${sans.variable} ${serif.variable} ${arabic.variable}`} suppressHydrationWarning={true}>
      <body className={`${sans.className} antialiased selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
