"use client";

import { useEffect, useState } from "react";
import { getUsers, API_URL } from "@/lib/api";
import { FaUserShield, FaCrown, FaScroll, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const STATUS_LEVELS = [
  { id: "INITIE", label: "Initié", icon: FaScroll, color: "text-white/40", bg: "bg-white/5", border: "border-white/10" },
  { id: "GARDIEN", label: "Gardien", icon: FaUserShield, color: "text-[#8B7344]", bg: "bg-[#8B7344]/10", border: "border-[#8B7344]/30" },
  { id: "MAITRE", label: "Grand Maître", icon: FaCrown, color: "text-[#C5A059]", bg: "bg-[#C5A059]/10", border: "border-[#C5A059]/40" },
];

export default function CRMPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers(localStorage.getItem("token") || undefined);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CRM Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (userId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
        <p className="text-[#C5A059] font-serif italic tracking-widest animate-pulse">Sifting Through the Ritual Hierarchy...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-[2px] bg-[#C5A059]" />
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">CRM Ritual Support</h4>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-none">
            Ritual <span className="text-[#C5A059]">Custodians</span>
          </h1>
          <p className="text-foreground/40 font-serif italic text-lg ml-1">Manage the hierarchy of those who preserve the alchemical arts.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* User List */}
        <div className="lg:col-span-8 bg-card border border-[#C5A059]/10 p-12 space-y-10 shadow-xl rounded-sm">
           <div className="flex items-center justify-between border-b border-[#C5A059]/10 pb-8">
              <h3 className="text-3xl font-serif font-bold text-foreground uppercase tracking-widest">Inscribed Souls</h3>
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/40">{users.length} Total Practitioners</div>
           </div>

           <div className="space-y-4">
              <div className="grid grid-cols-12 px-8 py-5 text-[9px] font-black uppercase tracking-[0.5em] text-[#C5A059]">
                 <div className="col-span-1">ID</div>
                 <div className="col-span-4">Custodian</div>
                 <div className="col-span-3">Ritual Level</div>
                 <div className="col-span-3">Contribution</div>
                 <div className="col-span-1"></div>
              </div>
              <div className="divide-y divide-[#C5A059]/5">
                 {users.map(user => {
                   const status = STATUS_LEVELS.find(s => s.id === user.status) || STATUS_LEVELS[0];
                   const totalSpent = user.orders?.reduce((acc: number, o: any) => acc + parseFloat(o.total_price), 0) || 0;
                   return (
                     <div 
                       key={user.id} 
                       onClick={() => setSelectedUser(user)}
                       className={`grid grid-cols-12 px-6 py-8 items-center cursor-pointer transition-all hover:bg-[#C5A059]/5 group ${selectedUser?.id === user.id ? 'bg-[#C5A059]/5 border-l-2 border-l-[#C5A059]' : ''}`}
                     >
                        <div className="col-span-1 font-serif text-[#C5A059]/40 text-xs tabular-nums">#{user.id.toString().padStart(3, '0')}</div>
                        <div className="col-span-4 flex flex-col gap-1">
                           <span className="text-sm font-bold uppercase tracking-wider text-foreground group-hover:text-[#C5A059] transition-colors">{user.name}</span>
                           <span className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.2em]">{user.email}</span>
                        </div>
                        <div className="col-span-3">
                           <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${status.border} ${status.bg}`}>
                              <status.icon className={`text-[10px] ${status.color}`} />
                              <span className={`text-[9px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</span>
                           </div>
                        </div>
                        <div className="col-span-3 font-serif text-lg font-bold tabular-nums text-[#C5A059]">{totalSpent.toLocaleString()} MAD</div>
                        <div className="col-span-1 text-right text-foreground/20 group-hover:text-[#C5A059] transition-colors">
                           <FaChevronRight className="text-xs" />
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>

        {/* User Detail View */}
        <div className="lg:col-span-4 space-y-10">
           {selectedUser ? (
             <div className="bg-[#121212] border border-[#C5A059]/20 p-12 space-y-10 shadow-2xl rounded-sm sticky top-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-6">
                   <div className="w-32 h-32 bg-black border border-[#C5A059]/30 mx-auto flex items-center justify-center text-5xl font-serif text-[#C5A059] font-bold shadow-[0_0_40px_rgba(197,160,89,0.1)]">
                      {selectedUser.name[0].toUpperCase()}
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-widest">{selectedUser.name}</h2>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]/60">Initiated {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="space-y-8 pt-8 border-t border-[#C5A059]/10">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Rituals</span>
                         <p className="text-2xl font-serif font-bold text-white tabular-nums">{selectedUser.orders?.length || 0}</p>
                      </div>
                      <div className="space-y-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Investment</span>
                         <p className="text-2xl font-serif font-bold text-[#C5A059] tabular-nums">
                            {(selectedUser.orders?.reduce((acc: number, o: any) => acc + parseFloat(o.total_price), 0) || 0).toLocaleString()} MAD
                         </p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Elevation of Status</span>
                      <div className="grid grid-cols-1 gap-3">
                         {STATUS_LEVELS.map(level => {
                           const isActive = selectedUser.status === level.id;
                           return (
                             <button
                               key={level.id}
                               onClick={() => updateStatus(selectedUser.id, level.id)}
                               className={`flex items-center justify-between p-5 border transition-all ${isActive ? `${level.border} ${level.bg}` : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                             >
                                <div className="flex items-center gap-4">
                                   <level.icon className={`${isActive ? level.color : 'text-white/20'}`} />
                                   <div className="flex flex-col items-start translate-y-[-1px]">
                                      <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/40'}`}>{level.label}</span>
                                      {level.id === 'MAITRE' && <span className="text-[8px] font-black text-[#C5A059]/60 uppercase tracking-widest">Max Alchemical Rank</span>}
                                   </div>
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />}
                             </button>
                           );
                         })}
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-[#C5A059]/10">
                   <div className="p-6 bg-black/40 border border-white/5 rounded-sm">
                      <p className="text-xs font-serif italic text-white/40 leading-relaxed">
                         "To grant status is to trust the custody of our purest essences. Choose your Grand Masters wisely."
                      </p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full bg-[#121212] border border-white/5 flex flex-col items-center justify-center p-12 text-center space-y-6 rounded-sm opacity-40">
                <FaScroll className="text-6xl text-white/10" />
                <p className="font-serif italic text-white/40 text-lg">Select a custodian to view their alchemical resonance.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
