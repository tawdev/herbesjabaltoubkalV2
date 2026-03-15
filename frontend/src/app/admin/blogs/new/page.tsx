"use client";

import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">New Article</h1>
        <p className="text-foreground/40 font-medium">Create a new story for the Herbes Jabal Toubkal blog.</p>
      </div>

      <div className="bg-white rounded-[3rem] p-12 border shadow-sm">
        <BlogForm mode="create" />
      </div>
    </div>
  );
}
