"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { ThemeToggle } from "./ThemeToggle";
import { useSound } from "@/context/SoundContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { playPaperSound } = useSound();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isSearchOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, isProfileOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setCategories([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}/products?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
      
      // Extract unique categories names from results
      const uniqueCats: string[] = Array.from(new Set(data.map((p: any) => 
        typeof p.category === 'object' ? p.category.name : p.category
      ))).slice(0, 3) as string[];
      setCategories(uniqueCats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Removed local admin check as AuthContext handles it
  useEffect(() => {
    // Keep internal analytics or other effects if needed
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const navigateToProduct = (id: number) => {
    router.push(`/products/${id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const navigateToCategory = (category: string) => {
    router.push(`/products?category=${category}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Catalog" },
    { href: "/bundles", label: "Ritual Packs" },
    { href: "/about", label: "About Us" },
    { href: "/recipes", label: "Recipes" },
    { href: "/blog", label: "Manuscrits" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C5A059]/10 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
        <Link 
          href="/" 
          onClick={handleHomeClick}
          className="flex items-center transition-transform hover:scale-105"
        >
          <div className="relative h-20 w-20 md:h-24 md:w-24">
            <Image
              src="/images/logo/luxury_logo_transparent.png"
              alt="Herbes Jabal Toubkal"
              fill
              sizes="(max-width: 768px) 192px, 256px"
              className="object-contain"
              priority
            />
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={(e) => {
                  playPaperSound();
                  if (link.href === "/") handleHomeClick(e);
                }}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative group ${
                  isActive ? "text-[#C5A059]" : "text-foreground/70 hover:text-[#C5A059]"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-[#C5A059] transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <div className="relative" ref={searchRef}>
            <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Rechercher"
                className={`transition-all flex items-center gap-2 group flex ${isSearchOpen ? 'text-[#C5A059]' : 'text-foreground/70 hover:text-[#C5A059]'}`}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="group-hover:scale-110 transition-transform"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>

            {isSearchOpen && (
                <div className="absolute right-0 top-12 w-80 md:w-[520px] bg-card border border-[#C5A059]/30 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[100] backdrop-blur-xl">
                    <form onSubmit={handleSearch} className="p-5 border-b border-[#C5A059]/10 bg-background/50">
                        <div className="relative">
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Chercher une herbe, un pack..." 
                                className="w-full bg-transparent border-none py-3 px-1 text-[12px] font-bold uppercase tracking-[0.2em] text-[#C5A059] placeholder:text-[#C5A059]/20 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {isSearching && (
                                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
                                </div>
                            )}
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#C5A059] hover:scale-125 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                            </button>
                        </div>
                    </form>

                    <div className="max-h-[75vh] overflow-y-auto p-8 space-y-12">
                        {searchQuery.length < 2 ? (
                            <div className="space-y-6">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059]/40 border-b border-[#C5A059]/10 pb-2">Destinations Prisées</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Épices', 'Pack Ritual', 'Herbes Atlas', 'Thés'].map(tag => (
                                        <button key={tag} onClick={() => { setSearchQuery(tag); }} className="text-left text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-[#C5A059] transition-colors">• {tag}</button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Categories */}
                                {categories.length > 0 && (
                                    <div className="space-y-5">
                                        <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-[#C5A059]/30 flex items-center justify-between">
                                            <span>Sphères suggérées</span>
                                            <span className="h-px flex-1 bg-[#C5A059]/10 ml-4" />
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {categories.map((cat) => (
                                                <button 
                                                    key={cat}
                                                    onClick={() => navigateToCategory(cat)}
                                                    className="px-5 py-2 bg-foreground/5 border border-transparent hover:border-[#C5A059]/30 text-[9px] font-bold uppercase tracking-widest text-foreground/70 hover:text-[#C5A059] transition-all rounded-sm"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Products */}
                                <div className="space-y-5">
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-[#C5A059]/30 flex items-center justify-between">
                                        <span>Révélations Live</span>
                                        <span className="h-px flex-1 bg-[#C5A059]/10 ml-4" />
                                    </h4>
                                    {suggestions.length > 0 ? (
                                        <div className="space-y-2">
                                            {suggestions.map((p) => (
                                                <button 
                                                    key={p.id}
                                                    onClick={() => navigateToProduct(p.id)}
                                                    className="w-full flex items-center gap-6 p-4 hover:bg-foreground/5 transition-all text-left group border-l-2 border-transparent hover:border-[#C5A059]"
                                                >
                                                    <div className="relative w-14 h-14 bg-background border border-[#C5A059]/10 overflow-hidden shadow-inner">
                                                        <Image 
                                                            src={p.image.startsWith('http') ? p.image : `/images/products/${p.image}`} 
                                                            alt={p.name} 
                                                            fill 
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <span className="text-[11px] font-bold text-foreground uppercase tracking-wider group-hover:text-[#C5A059] transition-colors">{p.name}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-[#C5A059] font-serif italic">{p.price} MAD</span>
                                                            <span className="text-[7px] font-black uppercase tracking-widest text-foreground/20 px-2 py-0.5 border border-foreground/5">
                                                                {typeof p.category === 'object' ? p.category.name : p.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#C5A059]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center space-y-4">
                                            <div className="text-foreground/10 flex justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                            </div>
                                            <p className="text-[10px] text-foreground/30 font-serif italic">Aucune essence ne correspond à "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Action */}
                                {suggestions.length > 0 && (
                                    <button 
                                        onClick={handleSearch}
                                        className="w-full pt-8 border-t border-[#C5A059]/10 text-center text-[9px] font-black uppercase tracking-[0.6em] text-[#C5A059] hover:text-foreground transition-all group"
                                    >
                                        Invoquer tous les résultats
                                        <span className="ml-4 opacity-0 group-hover:opacity-100 transition-all">→</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
          </div>

          <ThemeToggle />

          <Link 
            href="/cart"
            aria-label={`View shopping cart with ${totalItems} items`}
            className="relative group p-2 transition-all hover:scale-110"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/70 group-hover:text-[#C5A059]"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C5A059] text-[9px] font-bold text-black shadow-lg">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Authentication / Profile */}
          <div className="relative" ref={profileRef}>
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 p-2 transition-all ${isProfileOpen ? 'text-[#C5A059] scale-110' : 'text-foreground/70'}`}
                  aria-label="User Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
                {/* User Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-card border border-[#C5A059]/30 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[110] p-6 text-center backdrop-blur-xl">
                    <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-6 border-b border-[#C5A059]/10 pb-4">{user.username}</div>
                    <Link 
                      href="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="block text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/40 hover:text-[#C5A059] mb-6 transition-colors"
                    >
                      Archive Personnel
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsProfileOpen(false); }}
                      className="block w-full text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 hover:text-red-500 transition-colors"
                    >
                      Dématerialiser
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login"
                className="p-2 text-foreground/70"
                aria-label="Client Login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              </Link>
            )}
          </div>

          {/* Burger Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground/70 hover:text-[#C5A059] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-background border-b border-[#C5A059]/10 shadow-2xl animate-in slide-in-from-top duration-300 z-40">
          <nav className="flex flex-col p-8 gap-6">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/") handleHomeClick(e);
                    setIsMenuOpen(false);
                  }}
                  className={`text-xs font-bold uppercase tracking-[0.3em] transition-colors ${
                    isActive ? "text-[#C5A059]" : "text-foreground/70 hover:text-[#C5A059]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
