"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { API_URL } from "@/lib/api";
import { getBlogImage } from "@/lib/images";
import Link from "next/link";

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`${API_URL}/blogs/${params.id}`, { cache: "no-store" } as any)
      .then((res) => {
        if (!res.ok) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) setBlog(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-foreground/30 font-bold animate-pulse text-2xl">Loading article...</div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-4xl font-bold text-foreground/30">Article not found</h1>
        <Link href="/blog" className="text-primary font-bold hover:underline">← Back to Stories</Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto py-24 px-6 lg:px-8 max-w-4xl">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-primary transition-colors mb-12"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Stories
      </Link>

      <header className="flex flex-col gap-8 mb-16">
        <div className="flex flex-col gap-4">
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Blog Article</span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">{blog.title}</h1>
        </div>
      </header>

      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[3rem] shadow-2xl mb-16">
        <Image
          src={getBlogImage(blog.image)}
          alt={blog.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="grid grid-cols-1 gap-16">
        <div>
          <div className="prose prose-xl prose-stone max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground/80 font-medium text-lg">
              {blog.content}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
