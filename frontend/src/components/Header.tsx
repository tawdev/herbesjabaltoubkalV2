"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { totalItems } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Catalog" },
    { href: "/about", label: "About Us" },
    { href: "/recipes", label: "Recipes" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#141414]/98 backdrop-blur shadow-2xl">
      <div className="container mx-auto flex h-28 items-center justify-between px-6 lg:px-8">
        <Link 
          href="/" 
          onClick={handleHomeClick}
          className="flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
        >
          <Image 
            src="/images/logo/20251202_105020 (1).png"
            alt="Herbes Jabal Toubkal Logo"
            width={240}
            height={72}
            quality={80}
            className="h-20 w-auto object-contain brightness-125 contrast-125"
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={link.href === "/" ? handleHomeClick : undefined}
              className="text-sm font-bold tracking-wide text-white transition-colors hover:text-primary relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <Link 
            href="/cart"
            aria-label={`View shopping cart with ${totalItems} items`}
            className="relative group p-2.5 rounded-full bg-white/10 border border-white/10 transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors group-hover:stroke-primary"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B3D08] text-[10px] font-bold text-white shadow-lg ring-2 ring-background animate-in zoom-in duration-300">
              {totalItems}
            </span>
          </Link>


          {/* Burger Menu Button */}
          <button 
            className="md:hidden p-2 text-white hover:text-primary transition-colors h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 active:scale-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-28 left-0 w-full bg-[#1a1a1a] border-b border-white/5 shadow-2xl animate-in slide-in-from-top duration-300 z-40">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href === "/") handleHomeClick(e);
                  setIsMenuOpen(false);
                }}
                className="text-lg font-bold p-2 text-white/90 hover:text-primary transition-colors border-b border-white/5 pb-4"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={isAdmin ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 rounded-xl bg-primary p-4 text-center font-black text-white transition-all active:scale-95 shadow-lg"
            >
              {isAdmin ? "Admin Dashboard" : "Admin Login"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
