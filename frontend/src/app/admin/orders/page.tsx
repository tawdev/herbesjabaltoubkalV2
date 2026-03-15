"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-secondary text-foreground';
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-foreground/50 font-medium">Track and process customer spice orders.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/10 border-b">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Address</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Total</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-foreground/30 font-bold animate-pulse">Loading orders...</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="px-8 py-6 text-center">
                    <span className="font-bold text-xs text-foreground/30">#{order.id + 1000}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm tracking-tight">{order.user_name}</span>
                      <span className="text-[10px] font-medium text-foreground/40 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        {order.user_email}
                      </span>
                      <span className="text-[10px] font-medium text-foreground/40 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {order.user_phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <p className="text-xs font-medium text-foreground/60 max-w-[200px] line-clamp-2">{order.user_address}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-primary text-sm">{order.total_price} MAD</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative inline-block">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`appearance-none pl-4 pr-10 py-2 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm ${getStatusStyle(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary transition-all hover:text-white"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-foreground/40 font-bold italic">No orders recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/30 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-secondary p-12 relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-8 right-8 p-3 rounded-full bg-secondary/20 hover:bg-secondary/40 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className="flex flex-col gap-10">
              <header className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black tracking-tight italic font-serif">Order Details</h2>
                  <span className="font-bold text-xs text-foreground/30">ID: #{selectedOrder.id + 1000}</span>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(selectedOrder.status)}`}>
                        {selectedOrder.status}
                   </span>
                   <span className="text-[10px] font-bold text-foreground/40">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Customer Info</span>
                   <div className="flex flex-col gap-2">
                      <p className="font-bold text-lg">{selectedOrder.user_name}</p>
                      <p className="text-xs font-medium text-foreground/60">{selectedOrder.user_email}</p>
                      <p className="text-xs font-medium text-foreground/60">{selectedOrder.user_phone}</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Shipping Address</span>
                   <p className="text-xs font-medium text-foreground/60 leading-relaxed italic">{selectedOrder.user_address}</p>
                </div>
              </div>

              <div className="space-y-6">
                 <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Order Items</span>
                 <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                   {selectedOrder.items?.map((item: any) => (
                     <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/10 border border-secondary shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2">
                             <img src={`/images/products/${item.product?.image}`} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold text-sm tracking-tight">{item.product?.name}</span>
                             <span className="text-[10px] text-foreground/40 font-bold">{item.quantity} x {item.price} MAD</span>
                          </div>
                        </div>
                        <span className="font-black text-sm text-primary">{(item.quantity * item.price).toFixed(2)} MAD</span>
                     </div>
                   ))}
                 </div>
              </div>

              <footer className="border-t border-secondary pt-8 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Amount</span>
                    <span className="text-3xl font-black text-primary">{selectedOrder.total_price} MAD</span>
                 </div>
                 <button 
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full bg-foreground text-background px-10 py-4 text-sm font-black transition-all hover:scale-105"
                 >
                   Fermer
                 </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
