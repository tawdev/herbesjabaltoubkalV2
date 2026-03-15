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
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Edit Article</h1>
        <p className="text-foreground/40 font-medium">Updating: "{blog.title}"</p>
      </div>

      <div className="bg-white rounded-[3rem] p-12 border shadow-sm">
        <BlogForm mode="edit" initialData={blog} />
      </div>
    </div>
  );
}
