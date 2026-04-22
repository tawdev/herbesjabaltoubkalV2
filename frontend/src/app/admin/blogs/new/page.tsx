"use client";

import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="space-y-12 pb-20 text-foreground font-serif">
      <header className="border-b border-[#C5A059]/10 pb-8">
        <h1 className="text-4xl font-serif font-bold tracking-[0.2em] text-[#C5A059] uppercase">Scribe New Ritual</h1>
        <p className="text-foreground/40 italic text-sm mt-2">Document the ancient wisdom of Jabal Toubkal for the generations to come.</p>
      </header>

      <div className="bg-card border border-[#C5A059]/10 p-12 shadow-2xl">
        <BlogForm mode="create" />
      </div>
    </div>
  );
}
