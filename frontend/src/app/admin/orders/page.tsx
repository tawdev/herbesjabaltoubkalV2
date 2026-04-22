"use client";

import { useEffect, useState } from "react";
import { getOrders, API_URL } from "@/lib/api";
import { getProductImage, getBundleImage } from "@/lib/images";
import { useRouter } from "next/navigation";
import { FaEye, FaChevronDown, FaReceipt, FaUser, FaLocationDot, FaEnvelope, FaPhone } from "react-icons/fa6";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { getOrders } = await import("@/lib/api");
      const data = await getOrders(token);
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('[AdminOrders] Fetch error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      
      if (msg.includes('401')) {
        localStorage.removeItem('token');
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getItemImage = (item: any) => {
    if (item.bundle) {
      return getBundleImage(item.bundle.image, item.bundle.name);
    }
    if (item.product) {
      return getProductImage(item.product.image, item.product.name);
    }
    // Final fallback
    return getProductImage("", "Pure Essence");
  };

  const getItemName = (item: any) => {
    return item.product?.name || item.bundle?.name || "Mystic Essence";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/10 text-yellow-600 border border-yellow-900/30 shadow-[0_0_15px_rgba(202,138,4,0.1)]';
      case 'processing': return 'bg-blue-900/10 text-blue-500 border border-blue-900/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case 'shipped': return 'bg-purple-900/10 text-purple-500 border border-purple-900/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]';
      case 'delivered': return 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 shadow-[0_0_15px_rgba(197,160,89,0.1)]';
      case 'cancelled': return 'bg-red-900/10 text-red-500 border border-red-900/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
      default: return 'bg-white/5 text-foreground/40 border border-white/10';
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Header */}
      <header className={`flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#C5A059]/10 pb-10 ${selectedOrder ? 'print:hidden' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-6 w-[2px] bg-[#C5A059]" />
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]/80">Transmission Log</h4>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground tracking-tight">Order <span className="text-[#C5A059]">Manifest</span></h1>
          <p className="text-foreground/40 font-serif italic text-lg">Track and process ancestral trade records from Jabal Toubkal.</p>
        </div>
        <div className="flex bg-card border border-[#C5A059]/10 p-2 rounded-sm backdrop-blur-sm shadow-xl">
           <div className="px-6 py-3 text-center border-r border-[#C5A059]/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50 mb-1">Total Active</p>
              <p className="text-2xl font-serif font-bold text-foreground">{orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}</p>
           </div>
           <div className="px-6 py-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50 mb-1">Total Value</p>
              <p className="text-2xl font-serif font-bold text-[#C5A059]">{orders.reduce((acc, o) => acc + parseFloat(o.total_price), 0).toLocaleString()} MAD</p>
           </div>
        </div>
      </header>

      {/* Modern Order Table */}
      <div className={`bg-card border border-[#C5A059]/10 shadow-2xl rounded-sm overflow-hidden backdrop-blur-sm ${selectedOrder ? 'print:hidden' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Incantation ID</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Custodian (Customer)</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Destiny (Location)</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Value Offering</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Phase (Status)</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] text-right">Manipulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center text-foreground/20 font-serif italic animate-pulse">Summoning orders...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center text-red-500/50 font-serif italic">
                    <p className="text-xl">The ritual failed: {error}</p>
                    <button onClick={() => fetchOrders()} className="mt-6 text-xs font-black uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/20 px-8 py-3 hover:bg-[#C5A059]/10 transition-all rounded-sm">Retry Evocation</button>
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#C5A059]/5 transition-all group">
                  <td className="px-10 py-8">
                    <span className="font-serif text-[#C5A059] text-base font-bold tracking-widest tabular-nums">#{order.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-sm uppercase tracking-wider text-foreground group-hover:text-[#C5A059] transition-colors">{order.user_name}</span>
                      <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{order.user_email}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 max-w-[300px]">
                     <p className="text-xs font-serif italic text-foreground/60 line-clamp-1 group-hover:line-clamp-none transition-all">{order.user_address}</p>
                  </td>
                  <td className="px-10 py-8">
                    <span className="font-serif text-[#C5A059] text-xl font-bold">{parseFloat(order.total_price).toLocaleString()} MAD</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="relative inline-block w-48">
                      <select 
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`w-full appearance-none pl-6 pr-12 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none transition-all ${getStatusStyle(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[#C5A059]">
                        <FaChevronDown size={12} />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] hover:text-foreground transition-all flex items-center justify-end gap-3 group/btn"
                    >
                      <FaEye size={14} className="group-hover/btn:scale-110 transition-transform" />
                      Inspect essence
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && !error && (
                <tr>
                   <td colSpan={6} className="px-10 py-32 text-center text-foreground/20 font-serif italic text-xl">The transmission log is silent.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ritual Inspection Modal (Details) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-background/95 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto custom-scrollbar print:static print:bg-white print:p-0 print:block">
          <div className="bg-card w-full max-w-4xl border border-[#C5A059]/20 p-10 md:p-20 relative animate-in zoom-in duration-500 shadow-2xl rounded-sm my-auto print:border-none print:shadow-none print:p-0 print:max-w-none print:w-full">
            
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-10 right-10 p-4 text-[#C5A059]/40 hover:text-[#C5A059] transition-all hover:rotate-90 print:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className="space-y-12 print:space-y-8 print:text-black">
               <header className="flex flex-col gap-6 print:gap-4 print:border-b-2 print:border-black print:pb-6">
                 <div className="flex items-center justify-between border-b border-[#C5A059]/10 pb-8 print:border-none print:pb-0">
                  <div className="space-y-1">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/50 print:text-black/40">Order Authentic Record</h4>
                     <h2 className="text-4xl font-serif text-[#C5A059] uppercase tracking-widest font-bold print:text-black print:text-5xl">Incantation Log</h2>
                  </div>
                  <span className="font-serif text-2xl text-foreground font-bold tracking-widest bg-black/40 px-6 py-3 border border-[#C5A059]/10 rounded-sm italic print:bg-white print:text-black print:border-black print:border-2">#{selectedOrder.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center gap-8">
                   <span className={`inline-block px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm ${getStatusStyle(selectedOrder.status)} print:border-2 print:border-black print:bg-white print:text-black`}>
                        {selectedOrder.status}
                   </span>
                   <span className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em] flex items-center gap-3 print:text-black">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40" />
                     {new Date(selectedOrder.created_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                   </span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-6">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] flex items-center gap-3 italic print:text-black">
                      <FaUser size={12} className="print:hidden" />
                      The Soul (Customer)
                    </h5>
                    <div className="bg-black/20 border border-[#C5A059]/5 p-8 space-y-4 rounded-sm print:bg-white print:border-black/10 print:p-0">
                       <p className="font-serif text-3xl font-bold tracking-wide uppercase text-foreground print:text-black">{selectedOrder.user_name}</p>
                       <div className="space-y-2">
                          <p className="text-xs font-bold text-foreground/50 flex items-center gap-3 print:text-black print:opacity-60"><FaEnvelope className="text-[#C5A059]/40 print:hidden" /> {selectedOrder.user_email}</p>
                          <p className="text-xs font-bold text-foreground/50 flex items-center gap-3 print:text-black print:opacity-60"><FaPhone className="text-[#C5A059]/40 print:hidden" /> {selectedOrder.user_phone}</p>
                       </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] flex items-center gap-3 italic print:text-black">
                      <FaLocationDot size={12} className="print:hidden" />
                      Destination Realm
                    </h5>
                    <div className="bg-black/20 border border-[#C5A059]/5 p-8 rounded-sm h-full flex items-center min-h-[140px] print:bg-white print:border-black/10 print:p-0 print:min-h-0">
                       <p className="text-lg font-serif italic text-foreground/70 leading-relaxed uppercase tracking-wider print:text-black">{selectedOrder.user_address}</p>
                    </div>
                </div>
              </div>

              <div className="space-y-8">
                 <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] flex items-center gap-3 italic border-b border-[#C5A059]/10 pb-4">
                   <FaReceipt size={12} />
                   Essence Components
                 </h5>
                 <div className="max-h-[350px] overflow-y-auto space-y-6 pr-6 custom-scrollbar print:max-h-none print:overflow-visible print:pr-0">
                   {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any) => (
                     <div key={item.id} className="flex items-center justify-between py-6 border-b border-[#C5A059]/5 hover:bg-[#C5A059]/5 transition-all px-4 group">
                        <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-black border border-[#C5A059]/10 flex items-center justify-center p-1 shadow-xl rounded-sm overflow-hidden">
                             <img 
                                src={getItemImage(item)} 
                                alt={getItemName(item)} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                             />
                          </div>
                          <div className="flex flex-col gap-2">
                             <span className="font-bold text-sm uppercase tracking-widest text-foreground group-hover:text-[#C5A059] transition-colors print:text-black">{getItemName(item)}</span>
                             <div className="flex items-center gap-4">
                               <div className="flex items-center gap-2">
                                 <span className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest bg-[#C5A059]/5 px-3 py-1 rounded-sm border border-[#C5A059]/10">{item.quantity} x Offering</span>
                                 {item.weight && (
                                   <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest bg-foreground/5 px-3 py-1 rounded-sm border border-foreground/10">{item.weight}</span>
                                 )}
                               </div>
                               <span className="text-xs font-serif text-foreground/60 italic">{parseFloat(item.price).toLocaleString()} MAD</span>
                             </div>
                          </div>
                        </div>
                        <span className="font-serif text-xl font-bold text-foreground tracking-widest tabular-nums">{(item.quantity * item.price).toLocaleString()} MAD</span>
                     </div>
                   ))}
                 </div>
              </div>

              <footer className="border-t border-[#C5A059]/20 pt-12 flex flex-col md:flex-row items-center justify-between gap-10 print:border-black print:pt-6">
                 <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059] print:text-black">Total Offering Manifested</span>
                    <div className="flex items-baseline gap-4">
                       <span className="text-6xl font-serif font-black text-[#C5A059] tabular-nums print:text-black">{parseFloat(selectedOrder.total_price).toLocaleString()}</span>
                       <span className="text-2xl font-serif text-foreground/40 font-bold uppercase tracking-widest print:text-black">MAD</span>
                    </div>
                 </div>
                 <div className="flex gap-6 w-full md:w-auto print:hidden">
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 md:flex-none border border-[#C5A059]/20 py-6 px-12 text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:bg-[#C5A059]/10 transition-all rounded-sm flex items-center justify-center gap-4 group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-y-[-2px] transition-transform"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                      Print Seal
                    </button>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 md:flex-none bg-[#C5A059] text-black px-16 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl shadow-[#C5A059]/20 rounded-sm font-bold"
                    >
                      Dissolve Record
                    </button>
                 </div>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
