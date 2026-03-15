"use client";

import { useState, useEffect } from "react";
import { getBlogs, API_URL } from "@/lib/api";
import Link from "next/link";

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground text-sm">Create and manage your spice stories.</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/20 border-b">
            <tr>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Article</th>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-right">Arabic Title</th>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Loading blogs...</td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No blog posts found.</td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{blog.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{blog.excerpt || "No excerpt"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-lg italic font-serif" dir="rtl">
                    {blog.title_ar}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link 
                      href={`/admin/blogs/edit/${blog.id}`}
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="text-sm font-bold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
