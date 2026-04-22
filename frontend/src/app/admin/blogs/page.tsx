"use client";

import { useState, useEffect } from "react";
import { getBlogs, API_URL } from "@/lib/api";
import Link from "next/link";
import { FaPlus, FaPencil, FaTrashCan, FaBookOpen, FaCalendarDays, FaPenToSquare } from "react-icons/fa6";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchBlogs();
      } else {
        const errText = await response.text();
        alert(`Failed to delete blog: ${errText}`);
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#C5A059]/10 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-6 w-[2px] bg-[#C5A059]" />
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]/80">Chronicle Archives</h4>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground tracking-tight">The Grimoire <span className="text-[#C5A059]">Chronicles</span></h1>
          <p className="text-foreground/40 font-serif italic text-lg">Scribe and manage ancestral tales and botanical wisdom for the Atlas.</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="px-10 py-5 bg-[#C5A059] text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-foreground hover:text-background flex items-center gap-4 rounded-sm shadow-xl shadow-[#C5A059]/10"
        >
          <FaPlus size={16} />
          Scribe New Article
        </Link>
      </header>

      {/* Modern Chronicle Table */}
      <div className="bg-card border border-[#C5A059]/10 shadow-2xl rounded-sm overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">The Narrative</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] text-right">Ancient Title (AR)</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Published Cycle</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/5">
              {loading ? (
                <tr>
                   <td colSpan={4} className="px-10 py-32 text-center text-foreground/20 font-serif italic animate-pulse">Summoning chronicles...</td>
                </tr>
              ) : Array.isArray(blogs) && blogs.length > 0 ? (
                blogs.map((blog: any) => (
                  <tr key={blog.id} className="hover:bg-[#C5A059]/5 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-base uppercase tracking-widest text-foreground group-hover:text-[#C5A059] transition-colors">{blog.title}</span>
                        <span className="text-xs text-foreground/40 line-clamp-1 italic max-w-md font-serif leading-relaxed">{blog.excerpt || "Silence envelopes this entry."}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <span className="font-serif text-2xl font-bold text-[#C5A059]/90 font-arabic" dir="rtl">{blog.title_ar}</span>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-foreground/40">
                          <FaCalendarDays className="text-[#C5A059]/30" />
                          {new Date(blog.created_at).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-10">
                        <Link 
                          href={`/admin/blogs/edit/${blog.id}`}
                          className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] hover:text-foreground transition-all flex items-center gap-3 group/btn"
                        >
                          <FaPenToSquare size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                          Refine
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id)}
                          className="text-[11px] font-black uppercase tracking-widest text-red-900/60 hover:text-red-500 transition-all flex items-center gap-3 group/btn"
                        >
                          <FaTrashCan size={14} className="group-hover/btn:scale-110 transition-transform" />
                          Dissolve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={4} className="px-10 py-32 text-center text-foreground/20 font-serif italic text-2xl tracking-widest">No chronicles found in the archives.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
