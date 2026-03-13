import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Herbes & Arômes | Spices of the World",
  description: "Authentic, aromatic, and natural spices delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable}`}>
      <body className={`${outfit.className} antialiased selection:bg-primary/20 selection:text-primary`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-20 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary italic font-serif tracking-tight">Tawabil</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-sm font-semibold transition-colors hover:text-primary relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
              <a href="/products" className="text-sm font-semibold transition-colors hover:text-primary relative group">
                Catalog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
              <a href="/recipes" className="text-sm font-semibold transition-colors hover:text-primary relative group">
                Recipes
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
              <a href="/contact" className="text-sm font-semibold transition-colors hover:text-primary relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            </nav>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm font-bold bg-secondary/50 px-4 py-2 rounded-full transition-hover hover:bg-secondary">
                <span className="relative">
                  Cart (0)
                  <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </span>
              </button>
              <a href="/admin/login" className="hidden sm:block rounded-full bg-foreground px-6 py-2.5 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-95">
                Admin
              </a>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-secondary/30 py-20 mt-20">
          <div className="container px-4 grid gap-12 md:grid-cols-4">
            <div className="col-span-2 space-y-6">
              <span className="text-3xl font-bold text-primary italic font-serif">Tawabil</span>
              <p className="max-w-md text-base text-foreground/70 leading-relaxed">
                Celebrating the art of flavor since 2025. We bring the finest, 
                non-GMO and ethically sourced spices from global markets 
                straight to your culinary workspace.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary/10 transition-colors border" />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary/10 transition-colors border" />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary/10 transition-colors border" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Discover</h4>
              <ul className="space-y-4 text-base text-foreground/70">
                <li><a href="/products" className="hover:text-primary transition-colors">Aromatic Spices</a></li>
                <li><a href="/recipes" className="hover:text-primary transition-colors">Culinary Recipes</a></li>
                <li><a href="/about" className="hover:text-primary transition-colors">Our Story</a></li>
                <li><a href="/shipping" className="hover:text-primary transition-colors">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4 text-base text-foreground/70">
                <li>Email: hello@tawabil.com</li>
                <li>Phone: +212 600 000 000</li>
                <li>Live Chat: 9AM - 6PM</li>
                <li>FAQ Center</li>
              </ul>
            </div>
          </div>
          <div className="container px-4 mt-20 border-t border-border/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-foreground/40 font-medium">
            <p>© 2026 Tawabil. Designed for Modern Epicureans.</p>
            <div className="flex gap-8">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
