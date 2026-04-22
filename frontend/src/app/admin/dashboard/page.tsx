"use client";

import { useEffect, useState } from "react";
import { getProductImage, getBundleImage } from "@/lib/images";
import { API_URL, getOrders, getProducts, getBundles, getContacts, getUsers } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { FaUserShield, FaFlask, FaExclamationTriangle } from "react-icons/fa";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    orders: any[];
    products: any[];
    bundles: any[];
    contacts: any[];
    users: any[];
  }>({
    orders: [],
    products: [],
    bundles: [],
    contacts: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const [orders, products, bundles, contacts, users] = await Promise.all([
          getOrders(token),
          getProducts({}),
          getBundles(),
          getContacts(token),
          getUsers(token),
        ]);
        setData({ 
          orders: Array.isArray(orders) ? orders : [], 
          products: Array.isArray(products) ? products : [], 
          bundles: Array.isArray(bundles) ? bundles : [], 
          contacts: Array.isArray(contacts) ? contacts : [],
          users: Array.isArray(users) ? users : []
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
        <p className="text-[#C5A059] font-serif italic tracking-widest animate-pulse">Consulting the Astral Logs...</p>
      </div>
    );
  }

  // Calculations
  const totalRevenue = data.orders.reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
  const activeOrders = data.orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
  
  // Stock Prediction Alg
  const criticalStock = data.products.filter(p => (p.stock || 0) <= (p.min_stock || 5));
  const emptyStock = data.products.filter(p => (p.stock || 0) === 0);

  // CRM Distribution
  const userStats = data.users.reduce((acc: any, u: any) => {
    const status = u.status || 'INITIE';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { INITIE: 0, GARDIEN: 0, MAITRE: 0 });

  const deliveredRevenue = data.orders
    .filter(o => o.status === 'delivered')
    .reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
  
  const newMessages = data.contacts.filter(c => !c.read).length;

  // Monthly Best Sellers Calculation
  const monthlyStats: any = {};
  data.orders.forEach((order: any) => {
    const d = new Date(order.created_at);
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    const key = `${month} ${year}`;
    
    if (!monthlyStats[key]) monthlyStats[key] = {};
    
    order.items?.forEach((item: any) => {
      const pid = item.product_id || item.bundle_id;
      if (!pid) return;
      if (!monthlyStats[key][pid]) {
        monthlyStats[key][pid] = {
          quantity: 0,
          product: item.product || item.bundle,
          isBundle: !!item.bundle_id
        };
      }
      monthlyStats[key][pid].quantity += item.quantity;
    });
  });

  const bestSellersByMonth = Object.entries(monthlyStats).map(([month, products]: [string, any]) => {
    const sorted = Object.values(products).sort((a: any, b: any) => b.quantity - a.quantity);
    return { month, ...(sorted[0] as any) };
  }).filter(item => item.product).sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

  const getItemImage = (item: any) => {
    if (item.isBundle) return getBundleImage(item.product?.image, item.product?.name);
    return getProductImage(item.product?.image, item.product?.name);
  };

  // Category Distribution
  const categoryStats = data.products.reduce((acc: any, p: any) => {
    const catName = p.category?.name || "Pure Essence";
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});
  const maxCatCount = Math.max(...(Object.values(categoryStats) as number[]), 1);

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-[2px] bg-[#C5A059]" />
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">Administration Suite</h4>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-none">
            Jabal <span className="text-[#C5A059]">Toubkal</span>
          </h1>
          <p className="text-foreground/40 font-serif italic text-lg ml-1">The convergence of heritage and global trade.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <Link href="/admin/orders" className="px-6 py-3 bg-card border border-[#C5A059]/20 text-[#C5A059] text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition-all rounded-sm shadow-sm">
             Procurements
           </Link>
           <Link href="/admin/products" className="px-8 py-3 bg-[#C5A059] border border-[#C5A059] text-black text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all rounded-sm shadow-lg shadow-[#C5A059]/10">
             New Essence
           </Link>
        </div>
      </header>

      {/* Hero Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { 
            label: "Sovereign Revenue", 
            value: `${totalRevenue.toLocaleString()}`, 
            sub: "MAD Total Flow", 
            trend: `+${((deliveredRevenue/totalRevenue)*100).toFixed(0)}% Refined`,
          },
          { 
            label: "Stock Prediction", 
            value: criticalStock.length.toString(), 
            sub: "Alerts Required", 
            trend: `${emptyStock.length} Completely Depleted`,
            alert: true
          },
          { 
            label: "The Sanctuary", 
            value: data.users.length.toString(), 
            sub: "Registered Custodians", 
            trend: `${userStats.MAITRE} Grand Masters`,
          },
          { 
            label: "Open Whispers", 
            value: newMessages.toString(), 
            sub: "Unread Messages", 
            trend: "Response Priority",
          },
        ].map((kpi, i) => (
          <div key={kpi.label} className="relative group overflow-hidden">
            <div className={`bg-card border ${kpi.alert && kpi.value !== '0' ? 'border-red-900/40 shadow-red-900/5' : 'border-[#C5A059]/10'} p-10 space-y-6 relative z-10 hover:border-[#C5A059]/40 transition-all duration-500 rounded-sm shadow-sm group-hover:shadow-2xl hover:-translate-y-1`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 blur-[60px] -z-10 group-hover:bg-[#C5A059]/10 transition-colors" />
              <div className="flex justify-between items-start">
                 <span className={`text-xs font-black uppercase tracking-[0.3em] ${kpi.alert && kpi.value !== '0' ? 'text-red-700' : 'text-[#C5A059]/80'}`}>{kpi.label}</span>
                 {kpi.alert && kpi.value !== '0' ? (
                   <FaExclamationTriangle className="text-red-600 animate-pulse" />
                 ) : (
                   <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse shadow-[0_0_8px_#C5A059]" />
                 )}
              </div>
              <div className="space-y-1">
                <h3 className={`text-5xl font-serif font-bold ${kpi.alert && kpi.value !== '0' ? 'text-red-800' : 'text-foreground'} tracking-tighter tabular-nums`}>{kpi.value}</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/50">{kpi.sub}</p>
              </div>
              <div className="pt-6 border-t border-[#C5A059]/10 flex items-center justify-between">
                <span className={`text-xs font-serif italic ${kpi.alert && kpi.value !== '0' ? 'text-red-900/60' : 'text-[#C5A059]'}`}>{kpi.trend}</span>
                <svg className="w-4 h-4 text-[#C5A059]/40 group-hover:text-[#C5A059] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Stock Prediction Center */}
        <div className="lg:col-span-2 bg-card border border-[#C5A059]/10 p-12 space-y-10 shadow-xl rounded-sm group overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-[100px] -z-10 group-hover:bg-[#C5A059]/10 transition-all duration-1000" />
           
           <div className="flex items-center justify-between border-b border-[#C5A059]/10 pb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <FaFlask className="text-[#C5A059]" />
                   <h3 className="text-3xl font-serif font-bold text-foreground uppercase tracking-widest">Prediction Center</h3>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-foreground/40">Inventory Longevity Analysis</p>
              </div>
              <Link href="/admin/products" className="px-6 py-2 bg-black text-[#C5A059] text-[9px] font-black uppercase tracking-widest border border-[#C5A059]/20 hover:border-[#C5A059] transition-all">Refine Inventory</Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {criticalStock.length > 0 ? (
                criticalStock.slice(0, 4).map((p: any) => (
                  <div key={p.id} className="flex gap-6 p-7 border border-red-900/10 hover:border-red-900/30 transition-all bg-red-950/[0.02] group/item">
                    <div className="relative w-24 h-24 bg-black border border-red-900/10 overflow-hidden shadow-2xl">
                      <Image 
                         src={getProductImage(p.image, p.name)} 
                         alt={p.name} 
                         fill 
                         unoptimized
                         className="object-cover opacity-50 group-hover/item:opacity-80 transition-all duration-700" 
                       />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                       <h4 className="text-sm font-bold uppercase tracking-wider text-foreground leading-tight line-clamp-1">{p.name}</h4>
                       <div className="flex items-center gap-2">
                          <span className="text-2xl font-serif font-bold text-red-700 tabular-nums">{p.stock}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">vs {p.min_stock || 5} min</span>
                       </div>
                       <div className="h-1 w-full bg-red-900/10 rounded-full overflow-hidden">
                          <div className="h-full bg-red-700" style={{ width: `${(p.stock / (p.min_stock || 5)) * 100}%` }} />
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-20 text-center space-y-4">
                   <FaFlask className="mx-auto text-[#C5A059]/20 text-5xl" />
                   <p className="font-serif italic text-foreground/40 text-lg">Alchemical balance achieved. No stock anomalies detected.</p>
                </div>
              )}
           </div>
        </div>

        {/* Ritual CRM Status Distribution */}
        <div className="bg-[#121212] border border-[#C5A059]/20 p-12 space-y-10 shadow-2xl rounded-sm">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <FaUserShield className="text-[#C5A059]" />
                 <h3 className="text-3xl font-serif font-bold text-[#C5A059] uppercase tracking-widest">Ritual CRM</h3>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Custodian Hierarchy</p>
           </div>
           
           <div className="space-y-10 pt-6">
              {[
                { label: "Grand Maître", key: "MAITRE", color: "from-[#C5A059] to-[#E5C079]", desc: "Full Ritual Authorization (-20%)" },
                { label: "Gardien", key: "GARDIEN", color: "from-[#8B7344] to-[#C5A059]", desc: "Trusted Scribe (-10%)" },
                { label: "Initié", key: "INITIE", color: "from-white/5 to-white/10", desc: "First Descent" },
              ].map((status) => (
                <div key={status.key} className="space-y-4 group">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold uppercase tracking-widest text-[#C5A059]">{status.label}</span>
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{status.desc}</span>
                    </div>
                    <span className="text-2xl font-serif text-white tabular-nums">{userStats[status.key] || 0}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div 
                       className={`h-full bg-gradient-to-r ${status.color} transition-all duration-1000`}
                       style={{ width: `${((userStats[status.key] || 0) / Math.max(data.users.length, 1)) * 100}%` }}
                     />
                  </div>
                </div>
              ))}
           </div>

           <Link href="/admin/crm" className="w-full block py-5 border border-[#C5A059]/20 text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] text-center hover:bg-[#C5A059] hover:text-black transition-all">Grant Royal Status</Link>
        </div>
      </div>

      {/* Monthly Transmissions & Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-card border border-[#C5A059]/10 p-12 space-y-10 shadow-xl rounded-sm">
           <div className="flex items-center justify-between border-b border-[#C5A059]/10 pb-8">
              <h3 className="text-3xl font-serif font-bold text-foreground uppercase tracking-widest">Transmission Log</h3>
              <Link href="/admin/orders" className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:text-foreground transition-colors">Historical Records</Link>
           </div>
           
           <div className="divide-y divide-[#C5A059]/5">
             {data.orders.slice(0, 6).map((order) => (
               <div key={order.id} className="grid grid-cols-12 py-8 items-center hover:bg-[#C5A059]/5 transition-colors group px-4">
                  <div className="col-span-2 font-serif text-[#C5A059] text-sm tabular-nums tracking-widest">#{order.id.toString().padStart(4, '0')}</div>
                  <div className="col-span-4 flex flex-col gap-1">
                     <span className="text-sm font-bold uppercase tracking-wider text-foreground">{order.user_name}</span>
                     <span className="text-[10px] text-foreground/40 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-3 font-serif text-xl font-bold tabular-nums text-[#C5A059]">{parseFloat(order.total_price).toLocaleString()} MAD</div>
                  <div className="col-span-3 text-right">
                     <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border rounded-full ${
                      order.status === 'pending' ? 'border-yellow-900/40 text-yellow-600 bg-yellow-950/10' :
                      order.status === 'delivered' ? 'border-[#C5A059]/60 text-[#C5A059] bg-[#C5A059]/10' :
                      'border-white/20 text-foreground/40'
                    }`}>
                      {order.status}
                    </span>
                  </div>
               </div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-4 bg-[#C5A059] p-12 flex flex-col justify-between aspect-square group overflow-hidden relative rounded-sm shadow-2xl">
           <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
           <div className="relative z-10 space-y-6">
              <span className="text-sm font-black uppercase tracking-[0.4em] text-black/60">Expansion Factor</span>
              <h2 className="text-4xl font-serif font-black text-black leading-none uppercase tracking-tighter">Your presence in the Atlas is growing.</h2>
           </div>
           <div className="relative z-10 pt-12 border-t border-black/20 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-5xl font-serif font-black text-black">{(data.users.length * 1.4).toFixed(0)}%</span>
                 <span className="text-xs font-black uppercase tracking-widest text-black/80">Affluence Ritual</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
