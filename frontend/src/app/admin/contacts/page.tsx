"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Messages & Contacts</h1>
        <p className="text-foreground/50 font-medium">Read and respond to customer inquiries.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 text-center text-foreground/30 font-bold animate-pulse">Loading messages...</div>
        ) : contacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-[2.5rem] border border-secondary shadow-sm p-8 flex flex-col gap-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl">
                  ✉️
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <span className="text-sm font-medium text-foreground/40">{contact.email}</span>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-secondary text-[10px] font-black uppercase tracking-widest text-foreground/40">
                {new Date(contact.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="p-6 rounded-3xl bg-secondary/10 border italic text-foreground/70 leading-relaxed font-serif">
              "{contact.message}"
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${contact.status === 'new' ? 'bg-primary animate-pulse' : 'bg-foreground/20'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Status: {contact.status}</span>
              </div>
              <button className="rounded-full bg-foreground text-background px-6 py-2 text-xs font-bold transition-transform active:scale-95">
                Mark as Read
              </button>
            </div>
          </div>
        ))}
        {!loading && contacts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center bg-secondary/10 border-2 border-dashed rounded-[3rem] text-foreground/30">
             <span className="text-4xl mb-2">🐚</span>
             <p className="font-bold italic">Your inbox is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
