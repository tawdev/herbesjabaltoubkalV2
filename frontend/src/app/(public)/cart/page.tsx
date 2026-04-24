"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getProductImage, getBundleImage } from "@/lib/images";
import { API_URL } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTrashCan, FaPlus, FaMinus, FaLock, FaTruckFast, FaShieldHalved, FaLeaf } from "react-icons/fa6";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems } = useCart();
  const { user, token } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Pre-fill info when starting checkout
  useEffect(() => {
    if (isCheckingOut && user && token) {
      // Fetch full profile to get phone and address
      fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrderInfo({
            name: data.name || user.username || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        })
        .catch((err) => console.error("Failed to pre-fill profile", err));
    }
  }, [isCheckingOut, user, token]);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 30 : 0;
  const total = subtotal + shipping;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Phone validation (Moroccan format)
    const phoneRegex = /^(?:\+212|0)([567]\d{8})$/;
    if (orderInfo.phone && !phoneRegex.test(orderInfo.phone)) {
      alert("Format téléphone invalide (+212 ou 06/07).");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        user_name: orderInfo.name,
        user_email: orderInfo.email,
        user_phone: orderInfo.phone,
        user_address: orderInfo.address,
        total_price: Number(total.toFixed(2)),
        items: items.map(item => ({
          product_id: item.id, 
          quantity: item.quantity,
          price: item.price,
          weight: item.weight
        }))
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        // Automatically save secrets to profile if seeker is logged in
        if (token) {
          fetch(`${API_URL}/auth/profile/update`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({
              name: orderInfo.name, // Added name
              phone: orderInfo.phone,
              address: orderInfo.address
            })
          }).catch(err => console.error("[Sanctum] Failed to archive profile secrets:", err));
        }

        setIsOrderSubmitted(true);
        clearCart();
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.message || "Échec de la commande"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderSubmitted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full border border-[#C5A059]/20 bg-card p-12 text-center space-y-10 shadow-2xl"
        >
          <div className="w-20 h-20 border-2 border-[#C5A059] rounded-full flex items-center justify-center mx-auto text-[#C5A059]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-serif text-[#C5A059] uppercase tracking-widest">Rituel Confirmé</h1>
            <p className="text-foreground/50 font-serif italic text-sm leading-relaxed">
              Votre commande a été reçue. Nos artisans de l'Atlas préparent vos herbes sacrées. Nous vous contacterons sous peu pour la livraison.
            </p>
          </div>
          <Link 
            href="/" 
            className="block w-full border border-[#C5A059] py-5 text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all"
          >
            Retour au Sanctuaire
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center text-center px-6 gap-12">
        <div className="text-[#C5A059]/10">
           <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif text-[#C5A059] uppercase tracking-tighter">Votre Sanctuaire <br /><span className="text-foreground/10 italic lowercase">est encore vide</span></h1>
            <p className="text-foreground/40 font-serif italic max-w-sm mx-auto">Explorez nos herbes rares et commencez votre voyage sensoriel dès aujourd'hui.</p>
        </div>
        <Link 
          href="/products" 
          className="border border-[#C5A059] px-16 py-6 text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all"
        >
          Découvrir la Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-40 transition-colors duration-500">
      <div className="container mx-auto py-32 px-6 lg:px-12">
        <header className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 mb-24 text-center lg:text-left">
            <div className="flex flex-col gap-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059]">The Selection</span>
               <h1 className="text-5xl md:text-7xl font-serif text-[#C5A059] uppercase tracking-tighter leading-none">Votre <span className="italic">Panier</span></h1>
            </div>
            <button 
               onClick={clearCart}
               className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/50 hover:text-red-500 transition-all border border-red-500/10 hover:border-red-500/30 px-6 py-3 rounded-sm flex items-center gap-2 group"
            >
               <FaTrashCan className="group-hover:rotate-12 transition-transform" />
               Vider le Panier
            </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          {/* Cart Items */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-10 p-8 border border-[#C5A059]/10 bg-card relative group transition-all hover:border-[#C5A059]/30">
                <div className="relative aspect-square h-40 md:h-32 w-full md:w-32 bg-background border border-[#C5A059]/5 overflow-hidden">
                  <Image 
                    src={String(item.id).startsWith("bundle-") ? getBundleImage(item.image) : getProductImage(item.image, item.name)} 
                    alt={item.name} 
                    fill 
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2 space-y-8 md:space-y-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-foreground uppercase tracking-wide">{item.name}</h3>
                       <p className="text-[9px] text-[#C5A059] font-black uppercase tracking-[0.3em] bg-[#C5A059]/5 px-2 py-0.5 border border-[#C5A059]/10 rounded-sm inline-block">
                         {item.weight || 'Premium Grade'}
                       </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-foreground/10 hover:text-red-500 transition-all p-3 border border-transparent hover:border-red-500/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center border-t border-foreground/5 pt-6">
                    <div className="flex items-center border border-foreground/10 px-4 bg-background">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#C5A059]/50 hover:text-[#C5A059] transition-colors"
                      >
                       -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-foreground/70">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#C5A059]/50 hover:text-[#C5A059] transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-foreground/20 uppercase tracking-widest mb-1">Prix Global</span>
                        <span className="text-xl font-serif text-[#C5A059]">{(item.price * item.quantity).toFixed(2)} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Order Summary / Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 sticky top-40"
          >
            <div className="p-12 border border-[#C5A059]/10 bg-card space-y-12 shadow-sm">
              {!isCheckingOut ? (
                <>
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">Sommaire</span>
                    <h2 className="text-4xl font-serif text-foreground uppercase tracking-tight leading-none italic">L'Expédition</h2>
                  </div>
                  
                  <div className="space-y-6 text-[11px] font-bold uppercase tracking-[0.2em] pt-8 border-t border-[#C5A059]/10">
                    <div className="flex justify-between text-foreground/40">
                      <span>Herbes & Mélanges</span>
                      <span className="text-foreground/80">{subtotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between text-foreground/40">
                      <span>Livraison Atlas</span>
                      <span className="text-foreground/80">{shipping.toFixed(2)} MAD</span>
                    </div>
                    <div className="pt-8 border-t border-[#C5A059]/10 flex justify-between items-end">
                      <span className="text-foreground/60">Total Ritual</span>
                      <span className="text-3xl font-serif text-[#C5A059] tracking-tighter lowercase italic">{total.toFixed(2)} <span className="text-xs uppercase font-serif not-italic tracking-normal ml-1 border-b border-[#C5A059]/20">MAD</span></span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-[#C5A059] text-black py-7 text-[10px] font-bold uppercase tracking-[0.6em] transition-all hover:bg-foreground hover:text-background active:scale-[0.98]"
                  >
                    Passer à la Caisse
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmitOrder} className="flex flex-col gap-10">
                  <div className="flex items-center justify-between pb-8 border-b border-[#C5A059]/10">
                    <h2 className="text-2xl font-serif text-foreground uppercase tracking-tight">Vos <span className="italic">Secrets</span></h2>
                    <button 
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="text-[9px] font-black text-foreground/30 tracking-widest uppercase hover:text-[#C5A059] transition-all flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Retour
                    </button>
                  </div>

                  <div className="space-y-8">
                    {[
                        { id: 'name', type: 'text', placeholder: 'Nom complet', value: orderInfo.name },
                        { id: 'phone', type: 'tel', placeholder: 'Téléphone', value: orderInfo.phone },
                        { id: 'email', type: 'email', placeholder: 'Email (Optionnel)', value: orderInfo.email },
                    ].map((field) => (
                        <div key={field.id} className="relative group">
                            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-[#C5A059] absolute -top-3 left-0 opacity-0 group-focus-within:opacity-100 transition-all">{field.placeholder}</label>
                            <input
                                required={field.id !== 'email'}
                                type={field.type}
                                placeholder={field.placeholder}
                                pattern={field.id === 'phone' ? "^(?:\\+212|0)([567]\\d{8})$" : undefined}
                                title={field.id === 'phone' ? "Format: +212... ou 06... / 07... / 05..." : undefined}
                                className="w-full bg-transparent border-b border-foreground/10 py-4 text-foreground font-serif italic text-sm focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-foreground/20"
                                value={field.value}
                                onChange={(e) => {
                                    let val = e.target.value;
                                    if (field.id === "phone") {
                                        val = val.replace(/[^\d+]/g, "");
                                    }
                                    setOrderInfo({ ...orderInfo, [field.id]: val });
                                }}
                            />
                        </div>
                    ))}
                    <div className="relative group">
                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-[#C5A059] absolute -top-3 left-0 opacity-0 group-focus-within:opacity-100 transition-all">Destination Finale</label>
                        <textarea
                            required
                            placeholder="Adresse de livraison complète"
                            rows={3}
                            className="w-full bg-transparent border border-foreground/10 p-6 text-foreground font-serif italic text-sm focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-foreground/20 resize-none rounded-sm"
                            value={orderInfo.address}
                            onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="space-y-8 pt-8 border-t border-[#C5A059]/10">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold">À Sceller</span>
                      <span className="text-4xl font-serif text-[#C5A059] italic lowercase tracking-tighter">{total.toFixed(2)} <span className="text-xs uppercase font-serif not-italic tracking-normal ml-1">MAD</span></span>
                    </div>

                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-black dark:bg-[#C5A059] text-[#C5A059] dark:text-black py-7 text-[10px] font-bold uppercase tracking-[0.5em] transition-all hover:bg-[#C5A059] hover:text-black dark:hover:bg-white disabled:opacity-50 shadow-xl shadow-black/10"
                    >
                      {isSubmitting ? "Scellage en cours..." : "Lancer le Ritual (Commander)"}
                    </button>

                    <div className="relative flex items-center justify-center py-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-foreground/5"></span></div>
                        <span className="relative bg-card px-4 text-[8px] font-black uppercase tracking-widest text-foreground/20">Ou Plus Direct</span>
                    </div>

                    <button 
                        type="button"
                        onClick={() => {
                            const WHATSAPP_NUMBER = "212626573849"; // Remplacez par votre numéro
                            const itemsList = items.map(i => `• ${i.name} (${i.quantity}x) - ${(i.price * i.quantity).toFixed(2)} MAD`).join('\n');
                            const message = `🌿 *Nouvelle Commande Jabal Toubkal*\n\n*Client:* ${orderInfo.name}\n*Tél:* ${orderInfo.phone}\n*Adresse:* ${orderInfo.address || 'À préciser'}\n\n*Articles :*\n${itemsList}\n\n*Total:* ${total.toFixed(2)} MAD\n\n_Commande générée depuis le site web._`;
                            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-[#25D366] hover:text-white flex items-center justify-center gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                        WhatsApp Direct
                    </button>
                  </div>
                </form>
              )}
              
              <div className="mt-12 p-8 border border-foreground/5 bg-foreground/5 flex items-center gap-6 group hover:border-[#C5A059]/30 transition-all">
                <div className="w-12 h-12 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]/60 group-hover:text-[#C5A059] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-7a2 2 0 0 0-2-2h-5"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/20 uppercase">Rituel de Paiement</span>
                  <span className="text-[10px] font-bold text-foreground/60 tracking-widest uppercase">Contre remboursement</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
