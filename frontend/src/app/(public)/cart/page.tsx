"use client";

import { useCart } from "@/context/CartContext";
import { getProductImage } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 30 : 0; // Flat fee for demo
  const total = subtotal + shipping;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        user_name: orderInfo.name,
        user_email: orderInfo.email,
        user_phone: orderInfo.phone,
        user_address: orderInfo.address,
        total_price: total,
        items: items.map(item => ({
          product_id: Number(item.id),
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
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
      <div className="container mx-auto py-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 text-4xl text-emerald-600 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Commande Réussie !</h1>
        <p className="text-foreground/50 mb-12 max-w-sm">
          Merci pour votre confiance. Votre commande est en cours de traitement. Vous recevrez un appel de confirmation bientôt.
        </p>
        <Link 
          href="/" 
          className="rounded-full bg-primary px-10 py-4 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mb-8 text-primary/40">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-foreground/50 mb-12 max-w-sm">
          Découvrez nos trésors de l'Atlas et commencez à remplir votre panier !
        </p>
        <Link 
          href="/products" 
          className="rounded-full bg-primary px-10 py-4 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Voir le Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-6 lg:px-8 text-center md:text-left">
      <h1 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-6 rounded-[2rem] bg-white border border-secondary shadow-sm group transition-all hover:shadow-md">
              <div className="relative h-24 w-24 rounded-2xl bg-secondary/10 flex-shrink-0 overflow-hidden">
                <Image 
                  src={getProductImage(item.image, item.name)} 
                  alt={item.name} 
                  fill 
                  className="object-contain p-2"
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mt-1">
                      {item.weight}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-foreground/20 hover:text-red-500 transition-colors bg-secondary/20 p-2 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center border rounded-full px-3 py-1 bg-secondary/10">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-black text-lg text-primary">{item.price * item.quantity} MAD</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary / Checkout Form */}
        <div className="lg:col-span-1">
          <div className="p-10 rounded-[2.5rem] bg-secondary/20 border border-secondary/50 sticky top-32">
            {!isCheckingOut ? (
              <>
                <h2 className="text-2xl mb-8 italic font-serif">Résumé de la commande</h2>
                
                <div className="flex flex-col gap-5 text-sm font-bold">
                  <div className="flex justify-between text-foreground/50">
                    <span>Sous-total</span>
                    <span>{subtotal} MAD</span>
                  </div>
                  <div className="flex justify-between text-foreground/50">
                    <span>Livraison</span>
                    <span>{shipping} MAD</span>
                  </div>
                  <div className="h-px bg-foreground/10 my-2" />
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-primary">{total} MAD</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full mt-10 rounded-full bg-primary py-5 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Commander
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmitOrder} className="flex flex-col gap-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl italic font-serif">Vos Informations</h2>
                  <button 
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Retour
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <input
                    required
                    type="text"
                    placeholder="Nom complet"
                    className="w-full rounded-2xl bg-white border border-secondary p-4 outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={orderInfo.name}
                    onChange={(e) => setOrderInfo({ ...orderInfo, name: e.target.value })}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Téléphone (ex: 06 12 34 56 78)"
                    className="w-full rounded-2xl bg-white border border-secondary p-4 outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={orderInfo.phone}
                    onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email (Optionnel)"
                    className="w-full rounded-2xl bg-white border border-secondary p-4 outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={orderInfo.email}
                    onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })}
                  />
                  <textarea
                    required
                    placeholder="Adresse de livraison complète"
                    rows={3}
                    className="w-full rounded-2xl bg-white border border-secondary p-4 outline-none focus:border-primary transition-colors text-sm font-medium resize-none"
                    value={orderInfo.address}
                    onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                  />
                </div>

                <div className="h-px bg-foreground/10 my-2" />
                
                <div className="flex justify-between items-center font-black">
                  <span className="text-sm uppercase tracking-widest text-foreground/40">Total à payer</span>
                  <span className="text-2xl text-primary">{total} MAD</span>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full rounded-full bg-primary py-5 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {isSubmitting ? "Traitement..." : "Confirmer la Commande"}
                </button>
              </form>
            )}
            
            <div className="mt-8 p-4 rounded-2xl bg-white border border-dashed border-primary/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-7a2 2 0 0 0-2-2h-5"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Mode de paiement</span>
                <span className="text-xs font-bold">Paiement à la livraison (Poste)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
