"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  if (!user) return <div className="min-h-screen bg-secondary/10 flex items-center justify-center font-bold text-primary animate-pulse">Loading Admin Panel...</div>;

  const navItems = [
    { 
      name: "Overview", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      ), 
      href: "/admin/dashboard" 
    },
    { 
      name: "Products", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      ), 
      href: "/admin/products" 
    },
    { 
      name: "Stock Management", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
      ), 
      href: "/admin/stock" 
    },
    { 
      name: "Recipes", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
      ), 
      href: "/admin/recipes" 
    },
    { 
      name: "Recipe Editor", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      ), 
      href: "/admin/recipes/editor" 
    },
    { 
      name: "Ritual CRM", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ), 
      href: "/admin/crm" 
    },
    { 
      name: "Les Coffrets de l'Atlas", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></svg>
      ), 
      href: "/admin/bundles" 
    },
    { 
      name: "Blog", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
      ), 
      href: "/admin/blogs" 
    },
    { 
      name: "Orders", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      ), 
      href: "/admin/orders" 
    },
    { 
      name: "Contacts", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      ), 
      href: "/admin/contacts" 
    },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground font-serif">
      {/* Sidebar */}
      <aside className="w-80 bg-card border-r border-[#C5A059]/20 flex flex-col fixed inset-y-0 z-50 shadow-2xl backdrop-blur-md print:hidden">
        <div className="h-28 flex flex-col justify-center px-10 border-b border-[#C5A059]/10 bg-gradient-to-br from-[#C5A059]/5 to-transparent">
          <span className="text-2xl font-bold text-[#C5A059] tracking-[0.2em] uppercase leading-tight font-serif">Jabal Toubkal</span>
          <span className="text-[10px] uppercase font-black text-foreground/60 tracking-[0.4em] mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            Sanctum Admin
          </span>
        </div>
        
        <nav className="flex-1 p-8 space-y-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-6 px-8 py-5 text-xs font-black uppercase tracking-[0.35em] transition-all duration-500 border ${
                  isActive 
                  ? "bg-[#C5A059] text-black border-[#C5A059] shadow-[0_15px_35px_rgba(197,160,89,0.3)] scale-[1.03]" 
                  : "text-foreground/50 border-transparent hover:text-foreground hover:border-[#C5A059]/30 hover:bg-[#C5A059]/5 hover:translate-x-1"
                } rounded-sm`}
              >
                <span className={`transition-transform duration-500 ${isActive ? 'text-black scale-110' : 'text-[#C5A059]'}`}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-10 border-t border-[#C5A059]/10 mt-auto bg-black/5">
          <div className="flex items-center gap-5 mb-8 px-2 group cursor-default">
            <div className="w-14 h-14 bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] font-bold text-2xl rounded-sm group-hover:bg-[#C5A059] group-hover:text-black transition-all">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold uppercase tracking-wider text-foreground truncate max-w-[140px]">{user.username}</span>
              <span className="text-[11px] uppercase font-black text-[#C5A059]/80 leading-none tracking-[0.3em]">Administrator</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-4 py-5 border border-red-900/40 text-red-600 text-xs font-black uppercase tracking-widest transition-all hover:bg-red-600 hover:text-white rounded-sm group shadow-sm hover:shadow-red-600/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Vanish (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-16 bg-background/50 relative overflow-hidden min-h-screen print:ml-0 print:p-0 print:bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 blur-[150px] -z-10 rounded-full print:hidden" />
        <div className="relative z-10 print:static">
          {children}
        </div>
      </main>
    </div>
  );
}
