"use client";

import { useEffect, useState } from "react";
import { getBlog } from "@/lib/api";
import BlogForm from "@/components/admin/BlogForm";
import { useParams } from "next/navigation";

export default function EditBlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getBlog(params.id as string)
        .then(setBlog)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="p-8">Loading article...</div>;
  if (!blog) return <div className="p-8 text-red-500 font-bold">Article not found.</div>;

  return (
    <div className="space-y-12 pb-20 text-foreground font-serif">
      <header className="border-b border-[#C5A059]/10 pb-8">
        <h1 className="text-4xl font-serif font-bold tracking-[0.2em] text-[#C5A059] uppercase">Refine Chronicle</h1>
        <p className="text-foreground/40 italic text-sm mt-2">Adjusting the records of spice history: "{blog.title}"</p>
      </header>

      <div className="bg-card border border-[#C5A059]/10 p-12 shadow-2xl">
        <BlogForm mode="edit" initialData={blog} />
      </div>
    </div>
  );
}
