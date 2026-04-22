"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

type Tab = "info" | "orders" | "addresses";

export default function ProfilePage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("info");
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (token) {
      fetchProfile();
      if (activeTab === "orders") {
        fetchOrders();
      }
    }
  }, [user, token, isLoading, router, activeTab]);

  const fetchOrders = async () => {
    setFetchingOrders(true);
    try {
      const res = await fetch(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setFetchingOrders(false);
    }
  };

  const fetchProfile = async () => {
    try {
        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
        setFormData({
            name: data.name,
            phone: data.phone || "",
            address: data.address || "",
        });
        setFetching(false);
    } catch (err) {
        console.error("Failed to fetch profile", err);
        setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
        const res = await fetch(`${API_URL}/auth/profile/update`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const updated = await res.json();
            setProfile(updated);
            setIsEditing(false);
            setMessage("Votre profil a été mis à jour avec succès.");
            setTimeout(() => setMessage(""), 3000);
        } else {
            setMessage("Une erreur est survenue lors de la mise à jour.");
        }
    } catch (err) {
        setMessage("Impossible de joindre le serveur.");
    } finally {
        setSaving(false);
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059] mb-4 block"
            >
                {activeTab === "info" ? "Espace Personnel" : activeTab === "orders" ? "Historique" : "Lieux de livraison"}
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-serif uppercase tracking-tight"
            >
                {activeTab === "info" ? (<>Votre <span className="italic">Profil</span></>) : 
                 activeTab === "orders" ? (<>Vos <span className="italic">Commandes</span></>) : 
                 (<>Vos <span className="italic">Adresses</span></>)}
            </motion.h1>
          </div>
          
          <AnimatePresence>
            {message && (
                <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/5 px-4 py-2"
                >
                    {message}
                </motion.p>
            )}
          </AnimatePresence>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="p-8 bg-card border border-[#C5A059]/10 rounded-2xl text-center shadow-sm">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center text-[#C5A059] text-3xl font-serif mx-auto mb-6">
                {profile?.name.charAt(0)}
              </div>
              <h3 className="text-xl font-serif mb-1">{profile?.name}</h3>
              <p className="text-[10px] text-foreground/40 mb-6 font-bold uppercase tracking-widest">Membre depuis {profile ? new Date(profile.created_at).getFullYear() : '...'}</p>
              
              <button 
                onClick={logout}
                className="w-full py-4 text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 border border-red-500/10 transition-all rounded-lg"
              >
                Vanish (Déconnexion)
              </button>
            </div>

            <nav className="flex flex-col gap-2 p-1 bg-foreground/5 rounded-xl">
                <button 
                    onClick={() => setActiveTab("info")}
                    className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg ${activeTab === "info" ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}
                >
                    Informations
                </button>
                <button 
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg ${activeTab === "orders" ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}
                >
                    Commandes
                </button>
                <button 
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg ${activeTab === "addresses" ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}
                >
                    Adresses
                </button>
            </nav>
          </motion.div>

          {/* Tab Content Rendering */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 min-h-[400px]"
          >
            {activeTab === "info" && (
                <div className="space-y-12">
                   {!isEditing ? (
                        <div className="space-y-12">
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Email Identity</label>
                                    <p className="text-xl font-serif border-b border-foreground/10 py-2">{profile?.email}</p>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Phone Link</label>
                                    <p className="text-xl font-serif border-b border-foreground/10 py-2">{profile?.phone || "Disconnected"}</p>
                                </div>
                            </section>

                            <div className="space-y-3">
                                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Primary Abode</label>
                                <p className="text-xl font-serif border-b border-foreground/10 py-2 leading-relaxed">
                                    {profile?.address || "No address forged yet."}
                                </p>
                            </div>

                            <div className="pt-12 border-t border-foreground/10">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="px-12 py-5 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-foreground hover:text-background transition-all shadow-xl shadow-black/10"
                                >
                                    Éditer le profil
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="relative">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4 block">New Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="w-full bg-transparent border-b-2 border-foreground/10 py-3 text-xl font-serif outline-none focus:border-[#C5A059] transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4 block">New Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-transparent border-b-2 border-foreground/10 py-3 text-xl font-serif outline-none focus:border-[#C5A059] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4 block">New Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    rows={4}
                                    className="w-full bg-transparent border-2 border-foreground/10 p-6 text-xl font-serif outline-none focus:border-[#C5A059] transition-all resize-none rounded-xl"
                                />
                            </div>

                            <div className="flex flex-wrap gap-4 pt-12 border-t border-foreground/10">
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className="px-10 py-5 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-foreground hover:text-background transition-all"
                                >
                                    {saving ? "Forge en cours..." : "Sceller les changements"}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-10 py-5 bg-transparent border border-foreground/10 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/40 hover:text-foreground transition-all"
                                >
                                    Fermer
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {activeTab === "orders" && (
                <div className="space-y-8">
                    {fetchingOrders ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map((order: any) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={order.id} 
                                    className="p-8 bg-card border border-[#C5A059]/10 rounded-2xl shadow-sm hover:border-[#C5A059]/30 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-foreground/5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059]/40">Ritual Transmission</span>
                                            <span className="text-xl font-serif">Commande #{order.id + 1000}</span>
                                            <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.3em] border ${
                                                order.status === 'pending' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                                                order.status === 'delivered' ? 'border-[#C5A059]/30 text-[#C5A059] bg-[#C5A059]/5' :
                                                'border-foreground/10 text-foreground/30'
                                            }`}>
                                                {order.status || 'En attente'}
                                            </span>
                                            <span className="text-2xl font-serif text-[#C5A059]">{order.total_price} MAD</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 bg-foreground/5 rounded-lg overflow-hidden flex-shrink-0">
                                                    {(item.product?.image || item.bundle?.image) && (
                                                        <img 
                                                            src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `/images/products/${item.product.image}`) : `/images/bundles/${item.bundle.image}`}
                                                            alt=""
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">{item.product?.name || item.bundle?.name}</span>
                                                    <span className="text-[9px] font-serif italic text-[#C5A059]">{item.quantity} x {item.price} MAD</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {order.status === 'shipped' && (
                                        <div className="mt-8 pt-6 border-t border-dashed border-[#C5A059]/20 flex items-center gap-3">
                                            <div className="w-2 h-2 bg-[#C5A059] rounded-full animate-ping" />
                                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Votre colis traverse l'Atlas...</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border-2 border-dashed border-[#C5A059]/20 rounded-3xl">
                            <div className="w-16 h-16 bg-[#C5A059]/5 rounded-full flex items-center justify-center text-[#C5A059]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-serif uppercase tracking-tight">Le Ritual n'a pas encore commencé</h4>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/30">Votre historique de commandes apparaîtra ici.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "addresses" && (
                <div className="space-y-8">
                    <div className="p-8 border border-[#C5A059]/20 rounded-2xl bg-card relative group shadow-sm">
                        <span className="absolute top-4 right-6 text-[8px] font-black uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/5 px-2 py-1 rounded">Par défaut</span>
                        <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4">Adresse Actuelle</h4>
                        <p className="text-xl font-serif leading-relaxed text-foreground/80">
                            {profile?.address || "Aucune adresse forgée dans nos registres."}
                        </p>
                    </div>
                    <button className="w-full py-6 border-2 border-dashed border-[#C5A059]/20 text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]/60 hover:border-[#C5A059] hover:text-[#C5A059] transition-all rounded-2xl">
                        + Forger une nouvelle destination
                    </button>
                </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
