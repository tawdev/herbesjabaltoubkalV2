"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t bg-secondary/20 py-24 mt-24">
      <div className="container mx-auto px-6 lg:px-8 grid gap-16 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <Link 
            href="/" 
            onClick={handleHomeClick}
            className="flex flex-col gap-1 hover:opacity-90 transition-all"
          >
            <Image 
              src="/images/logo/20251202_105020 (1).png"
              alt="Herbes Jabal Toubkal Logo"
              width={180}
              height={54}
              quality={80}
              className="h-14 w-auto object-contain brightness-110"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mt-2">Pure Atlas Botanicals</span>
          </Link>
          <p className="max-w-md text-base text-foreground/70 leading-relaxed font-medium">
            Sourcing the finest aromatic treasures from the High Atlas. 
            We bring ethically harvested, naturally sun-dried herbs and 
            premium spices straight from Morocco to your kitchen.
          </p>
          <div className="flex gap-5">
            {[
              { name: "Instagram", icon: <FaInstagram size={18} />, href: "https://instagram.com" },
              { name: "Facebook", icon: <FaFacebookF size={18} />, href: "https://facebook.com" },
              { name: "Twitter", icon: <FaXTwitter size={18} />, href: "https://twitter.com" }
            ].map((social) => (
              <a 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
                className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all border border-secondary text-primary"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl mb-8 italic">Discover</h3>
          <ul className="space-y-5 text-sm font-bold text-foreground/80">
            <li><a href="/products" className="hover:text-primary transition-colors">Aromatic Spices</a></li>
            <li><a href="/recipes" className="hover:text-primary transition-colors">Culinary Recipes</a></li>
            <li><a href="/about" className="hover:text-primary transition-colors">Our Story</a></li>
            <li><a href="/shipping" className="hover:text-primary transition-colors">Shipping Info</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl mb-8 italic">Support</h3>
          <ul className="space-y-5 text-sm font-bold text-foreground/80">
            <li className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-700 font-black">Email Us</span>
              <span className="hover:text-primary transition-colors cursor-pointer text-slate-800">contact@herbesjabaltoubkal.com</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-700 font-black">Call Us</span>
              <span className="hover:text-primary transition-colors cursor-pointer text-slate-800">+212 524308038</span>
            </li>
            <li className="text-slate-800 font-semibold">Live Chat: 9AM - 6PM</li>
            <li className="text-slate-800 font-semibold">FAQ Center</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 lg:px-8 mt-24 border-t border-border/40 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-foreground/70 font-bold tracking-wide">
        <p>© 2026 <a href="https://cdigital.ma/" target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110 transition-all">cdigital</a>. Authentic Moroccan Heritage.</p>
        <div className="flex gap-10">
          <a href="/privacy" className="hover:text-foreground transition-all">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground transition-all">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
