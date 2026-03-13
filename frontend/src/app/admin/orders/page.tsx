"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/orders", {
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
      const res = await fetch(`http://localhost:3001/orders/${id}/status`, {
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
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-foreground/50 font-medium">Track and process customer spice orders.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/10 border-b">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Total</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-foreground/30 font-bold animate-pulse">Loading orders...</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-bold text-xs text-foreground/30 shadow-sm border px-3 py-1 rounded-lg">#{order.id + 1000}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm">{order.user_name}</span>
                      <span className="text-[10px] font-medium text-foreground/40">{order.user_email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold">{order.total_price} MAD</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-transparent text-xs font-bold border-none focus:ring-0 outline-none cursor-pointer hover:text-primary transition-colors"
                    >
                      <option value="pending">Mark Pending</option>
                      <option value="processing">Mark Processing</option>
                      <option value="shipped">Mark Shipped</option>
                      <option value="delivered">Mark Delivered</option>
                      <option value="cancelled">Mark Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-foreground/40 font-bold italic">No orders recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
