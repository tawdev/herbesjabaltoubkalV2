import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "@/lib/api";
import { getBlogImage } from "@/lib/images";

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto py-24 px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6 text-center mb-24">
        <div className="flex flex-col gap-2">
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Stories & Wisdom</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Our Spice Blog</h1>
        </div>
        <p className="text-foreground/80 max-w-2xl text-lg text-pretty font-semibold">
          Dive deep into the heritage, medicinal benefits, and culinary secrets of Moroccan Atlas mountain botanicals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {blogs.length === 0 ? (
          <div className="col-span-full py-20 text-center text-foreground/40 font-medium border-2 border-dashed border-secondary rounded-3xl">
            No stories published yet. Stay tuned!
          </div>
        ) : (
          blogs.map((blog: any) => (
            <Link 
              key={blog.id} 
              href={`/blog/${blog.id}`}
              aria-label={`Read more about ${blog.title}`}
              className="group flex flex-col gap-6 overflow-hidden rounded-3xl bg-secondary/10 border border-secondary/50 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getBlogImage(blog.image)}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm text-foreground/80">
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 p-8 pt-2">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                  <span className="text-sm text-foreground/70 font-bold">{blog.title_ar}</span>
                </div>
                <p className="text-foreground/80 line-clamp-3 text-sm leading-relaxed font-medium">
                  {blog.excerpt || blog.content.substring(0, 150) + "..."}
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-secondary">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Read More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
