"use client";

import { useEffect, useState } from "react";
import { getProductImage } from "@/lib/images";
import { API_URL } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    products: any[];
    orders: any[];
    contacts: any[];
  }>({ products: [], orders: [], contacts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [productsRes, ordersRes, contactsRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const products = await productsRes.json();
        const ordersRaw = await ordersRes.json();
        const contactsRaw = await contactsRes.json();

        // Guard against API errors (e.g. 401 returning {message: 'Unauthorized'})
        const orders = Array.isArray(ordersRaw) ? ordersRaw : [];
        const contacts = Array.isArray(contactsRaw) ? contactsRaw : [];
        const safeProducts = Array.isArray(products) ? products : [];

        setData({ products: safeProducts, orders, contacts });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-foreground/30 font-bold animate-pulse">Loading dashboard intelligence...</div>
      </div>
    );
  }

  // Real Stats Calculations
  const totalRevenue = data.orders
    .filter(o => o.status === 'delivered')
    .reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
  
  const activeOrders = data.orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
  const newMessages = data.contacts.filter(c => c.status === 'pending').length;
  const lowStockProducts = data.products.filter(p => p.stock !== null && p.stock <= 5);
  const outOfStockCount = data.products.filter(p => p.stock === 0).length;

  // Simple Analytics Data (Revenue by Category)
  const categoryStats = data.products.reduce((acc: any, p: any) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const maxCatCount = Math.max(...(Object.values(categoryStats) as number[]), 1);

  // Monthly Best Sellers Calculation
  const monthlyBestSellers = data.orders.reduce((acc: any, order: any) => {
    const date = new Date(order.created_at);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) acc[monthYear] = {};
    
    order.items.forEach((item: any) => {
      const pid = item.product_id;
      if (!acc[monthYear][pid]) {
        acc[monthYear][pid] = {
          quantity: 0,
          product: item.product
        };
      }
      acc[monthYear][pid].quantity += item.quantity;
    });
    
    return acc;
  }, {});

  const bestSellersByMonth = Object.entries(monthlyBestSellers).map(([month, products]: [string, any]) => {
    const topProduct = Object.values(products).reduce((prev: any, current: any) => {
      return (prev.quantity > current.quantity) ? prev : current;
    });
    return { month, ...(topProduct as any) };
  }).sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-foreground/50 font-medium">Welcome back to your spice empire control center.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Revenue", 
            value: `${totalRevenue.toLocaleString()} MAD`, 
            change: "From delivered orders", 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            ), 
            color: "text-emerald-600 bg-emerald-50" 
          },
          { 
            label: "Active Orders", 
            value: activeOrders.toString(), 
            change: "In progress", 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            ), 
            color: "text-blue-600 bg-blue-50" 
          },
          { 
            label: "Total Products", 
            value: data.products.length.toString(), 
            change: `${outOfStockCount} out of stock`, 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 6"/><path d="M7 20c-1.67 0-3-1.33-3-3s1.33-3 3-3"/><path d="M2 21c0-2 1-3.5 3-4"/><path d="M7 14c2-2 3-3.04 3-5.04"/></svg>
            ), 
            color: "text-primary bg-primary/5" 
          },
          { 
            label: "New Messages", 
            value: newMessages.toString(), 
            change: "Awaiting response", 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            ), 
            color: "text-purple-600 bg-purple-50" 
          },
        ].map((stat) => (
          <div key={stat.label} className="p-8 bg-white rounded-3xl border border-secondary shadow-sm flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
            <span className="text-xs font-bold text-foreground/40">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Monthly Best Sellers Leaderboard */}
      <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm p-10 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black italic font-serif">🏆 Monthly Best Sellers</h3>
          <p className="text-xs font-black uppercase tracking-widest text-foreground/30">Top product by volume</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellersByMonth.length === 0 ? (
            <div className="col-span-full p-12 text-center text-foreground/40 font-bold italic bg-secondary/10 rounded-3xl">
              No sales data available yet.
            </div>
          ) : (
            bestSellersByMonth.slice(0, 6).map((item: any) => (
              <div key={item.month} className="p-6 rounded-3xl bg-secondary/10 border border-transparent hover:border-secondary transition-all flex flex-col gap-6 group">
                <div className="flex justify-between items-start">
                   <span className="text-xs font-black uppercase tracking-widest text-primary">{item.month}</span>
                   <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                     Top Sold
                   </div>
                </div>
                <div className="flex items-center gap-5">
                   <div className="relative w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-md border group-hover:scale-105 transition-transform p-2">
                     <Image
                        src={getProductImage(item.product?.image, item.product?.name)}
                        alt={item.product?.name || ""}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight line-clamp-1">{item.product?.name}</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-foreground">{item.quantity}</span>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Units</span>
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Statistics & Analytics */}
        <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm p-10 space-y-10">
          <div>
            <h3 className="text-2xl font-black italic font-serif">Analytics & Stats</h3>
            <p className="text-sm font-medium text-foreground/40 mt-1">Product distribution by category.</p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(categoryStats).map(([cat, count]: [string, any]) => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-foreground/60">
                  <span>{cat}</span>
                  <span>{count} Products</span>
                </div>
                <div className="h-3 w-full bg-secondary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(count / maxCatCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-secondary flex items-center justify-between text-xs font-bold text-foreground/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Current Inventory Distribution</span>
            </div>
            <span>Auto-generated from live data</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black italic font-serif text-red-600">Low Stock Alert</h3>
            <Link href="/admin/products" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Manage Stock</Link>
          </div>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <div className="p-12 text-center text-foreground/40 font-bold italic bg-secondary/10 rounded-3xl">
                All products are well stocked.
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-5 rounded-2xl bg-red-50/30 border border-red-100/50 hover:bg-red-50 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="relative w-14 h-14 rounded-2xl bg-white overflow-hidden shadow-sm border border-red-100 p-2">
                      <Image
                        src={getProductImage(product.image, product.name)}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight">{product.name}</span>
                      <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest">
                        {product.stock === 0 ? "Out of stock" : `${product.stock} units remaining`}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href="/admin/products"
                    className="p-3 rounded-xl bg-white text-foreground border shadow-sm group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm overflow-hidden p-10 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black italic font-serif">Recent Orders</h3>
          <Link href="/admin/orders" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">View Sales History</Link>
        </div>
        <div className="space-y-4">
          {data.orders.length === 0 ? (
            <div className="p-12 text-center text-foreground/40 font-bold italic bg-secondary/10 rounded-3xl">
              No orders recorded yet.
            </div>
          ) : (
            data.orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/10 border border-transparent hover:border-secondary transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-bold text-xs text-foreground/30 shadow-sm border">
                    #{order.id + 1000}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tight">{order.user_name}</span>
                    <span className="text-[10px] text-foreground/40 font-extrabold uppercase tracking-widest">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <span className="text-sm font-black text-primary">{order.total_price} MAD</span>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-secondary text-foreground/40'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

