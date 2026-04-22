"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { FaMessage, FaEnvelope, FaCalendarDay, FaCircleCheck, FaUserSecret } from "react-icons/fa6";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
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
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#C5A059]/10 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-6 w-[2px] bg-[#C5A059]" />
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]/80">Transmission Reception</h4>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground tracking-tight">Whispers <span className="text-[#C5A059]">from</span> the World</h1>
          <p className="text-foreground/40 font-serif italic text-lg">Listen to the inquiries and souls reaching out to the Jabal Toubkal Sanctum.</p>
        </div>
        <div className="bg-card border border-[#C5A059]/10 px-8 py-4 rounded-sm flex items-center gap-6 shadow-xl backdrop-blur-sm">
           <div className="text-center border-r border-[#C5A059]/10 pr-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50 mb-1">Total Whispers</p>
              <p className="text-2xl font-serif font-bold text-foreground">{contacts.length}</p>
           </div>
           <div className="text-center pl-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50 mb-1">New Arrivals</p>
              <p className="text-2xl font-serif font-bold text-[#C5A059]">{contacts.filter(c => c.status === 'new').length}</p>
           </div>
        </div>
      </header>

      {/* Whisper Manifestation Grid */}
      <div className="grid grid-cols-1 gap-12">
        {loading ? (
          <div className="py-40 text-center flex flex-col items-center gap-6">
             <div className="w-12 h-12 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
             <span className="text-lg font-serif italic text-[#C5A059] tracking-widest animate-pulse">Gathering whispers from the ether...</span>
          </div>
        ) : Array.isArray(contacts) && contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-card border border-[#C5A059]/10 p-10 md:p-16 flex flex-col gap-10 hover:border-[#C5A059]/40 transition-all shadow-2xl relative overflow-hidden group rounded-sm">
              <div className="absolute top-0 right-0 p-1 bg-[#C5A059]/5 text-[#C5A059]/10 text-[10px] font-black uppercase tracking-[0.6em] rotate-45 translate-x-14 translate-y-6 w-48 text-center pointer-events-none">OFFICIAL TRANSMISSION</div>
              
              <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-[#C5A059]/5 pb-10">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-background border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]/30 text-3xl group-hover:border-[#C5A059]/60 group-hover:text-[#C5A059] transition-all duration-500 rounded-sm">
                    <FaUserSecret />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl font-bold uppercase tracking-widest text-foreground group-hover:text-[#C5A059] transition-colors">{contact.name}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-foreground/30 uppercase tracking-[0.2em]">
                       <FaEnvelope className="text-[#C5A059]/40" />
                       {contact.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-background px-6 py-3 border border-[#C5A059]/10 rounded-sm">
                   <FaCalendarDay className="text-[#C5A059]/40" size={14} />
                   <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">
                      {new Date(contact.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </span>
                </div>
              </div>
              
              <div className="relative p-12 bg-black/40 border border-[#C5A059]/5 rounded-sm overflow-hidden">
                <span className="absolute -top-2 -left-2 text-[120px] text-[#C5A059]/5 font-serif pointer-events-none">"</span>
                <p className="relative z-10 text-2xl font-serif italic text-foreground/80 leading-relaxed uppercase tracking-wider text-center max-w-4xl mx-auto">
                  {contact.message}
                </p>
                <span className="absolute -bottom-16 -right-2 text-[120px] text-[#C5A059]/5 font-serif pointer-events-none">"</span>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <span className={`h-2.5 w-2.5 rounded-full ${contact.status === 'new' ? 'bg-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.8)] animate-pulse' : 'bg-white/10'}`} />
                     <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/30 italic">Incarnation: {contact.status}</span>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Scribe is reaching out to the soul...")}
                  className="bg-transparent border border-[#C5A059]/20 text-[#C5A059] px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#C5A059] hover:text-black transition-all rounded-sm shadow-xl flex items-center gap-4 group/btn"
                >
                  <FaCircleCheck size={14} className="group-hover/btn:scale-110 transition-transform" />
                  Acknowledge Whisper
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-40 flex flex-col items-center justify-center bg-card border border-dashed border-[#C5A059]/10 rounded-sm">
             <div className="w-24 h-24 bg-background border border-[#C5A059]/10 rounded-full flex items-center justify-center mb-8">
                <FaMessage size={32} className="text-[#C5A059]/20" />
             </div>
             <p className="font-serif italic text-2xl text-foreground/20 tracking-widest uppercase">The winds are silent inside the Sanctum.</p>
          </div>
        )}
      </div>
    </div>
  );
}
