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
    { name: "Overview", icon: "📊", href: "/admin/dashboard" },
    { name: "Products", icon: "📦", href: "/admin/products" },
    { name: "Recipes", icon: "📜", href: "/admin/recipes" },
    { name: "Orders", icon: "🛒", href: "/admin/orders" },
    { name: "Contacts", icon: "✉️", href: "/admin/contacts" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col fixed inset-y-0 z-50">
        <div className="h-20 flex items-center px-8 border-b">
          <span className="text-2xl font-bold text-primary italic font-serif">Tawabil Admin</span>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-foreground/60 hover:bg-secondary/50 hover:text-primary"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t mt-auto">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold truncate max-w-[120px]">{user.username}</span>
              <span className="text-[10px] uppercase font-black text-foreground/30 leading-none tracking-widest">Administrator</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 text-sm font-bold transition-all hover:bg-red-100 active:scale-95"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        {children}
      </main>
    </div>
  );
}
