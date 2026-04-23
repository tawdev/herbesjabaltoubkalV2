import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Cairo } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: {
    default: "Herbes Jabal Toubkal | Épices et Herbes Premium du Haut Atlas",
    template: "%s | Herbes Jabal Toubkal"
  },
  description: "Découvrez l'excellence des épices marocaines et des herbes aromatiques pures du Haut Atlas. Trésors naturels cueillis à la main au pied du Jabal Toubkal. Safran, Ras el Hanout et mélanges ancestraux.",
  keywords: ["épices marocaines", "herbes du haut atlas", "Jabal Toubkal", "safran pur", "ras el hanout bio", "tisanes montagne", "produits terroir maroc"],
  authors: [{ name: "Herbes Jabal Toubkal" }],
  creator: "Herbes Jabal Toubkal",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://herbesjabaltoubkal.ma",
    title: "Herbes Jabal Toubkal | Trésors du Haut Atlas",
    description: "Épices et herbes aromatiques d'exception sourcées directement dans les montagnes du Toubkal.",
    siteName: "Herbes Jabal Toubkal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Herbes Jabal Toubkal | Épices Premium",
    description: "Le rituel des herbes de l'Atlas, livré chez vous.",
  },
};

import { SoundProvider } from "@/context/SoundContext";
import PageTransition from "@/components/PageTransition";
import LuxuryBackground from "@/components/LuxuryBackground";
import ThemeEclipse from "@/components/ThemeEclipse";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable} ${arabic.variable}`} suppressHydrationWarning={true}>
      <body className={`${sans.className} bg-background text-foreground antialiased selection:bg-[#C5A059]/30 selection:text-white min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <SoundProvider>
                <LuxuryBackground />
                <ThemeEclipse />
                <PageTransition>
                  {children}
                </PageTransition>
              </SoundProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
