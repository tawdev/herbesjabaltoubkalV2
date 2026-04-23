import Image from "next/image";
import Link from "next/link";
import { getProducts, getRecipes, getBlogs, getBundles } from "@/lib/api";
import { getRecipeImage, getBlogImage, getBundleImage } from "@/lib/images";
import { FaArrowRightLong, FaLocationDot, FaLeaf, FaScroll } from "react-icons/fa6";
import ProductCard from "@/components/ProductCard";
import BundleAddToCartButton from "@/components/BundleAddToCartButton";
import NewsletterSection from "@/components/NewsletterSection";

export default async function Home() {
  let bestSellers: any[] = [];
  let recipes: any[] = [];
  let blogs: any[] = [];
  let bundles: any[] = [];

  try {
    const [productsResult, recipesResult, blogsResult, bundlesResult] = await Promise.all([
      getProducts({}).catch(() => []),
      getRecipes().catch(() => []),
      getBlogs().catch(() => []),
      getBundles().catch(() => []),
    ]);

    bestSellers = productsResult.filter((p: any) => p.best_seller).slice(0, 4);
    if (bestSellers.length < 4) {
      bestSellers = productsResult.slice(0, 4);
    }
    
    recipes = recipesResult.slice(0, 3);
    blogs = blogsResult.slice(0, 3);
    bundles = bundlesResult.slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  return (
    <div className="flex flex-col bg-background selection:bg-[#C5A059] selection:text-black">
      {/* 🟢 Monumental Hero Section */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-110"
            poster="https://images.unsplash.com/photo-1509358271058-acd22cc93898"
          >
            <source src="https://cdn.pixabay.com/video/2021/08/04/83863-584742724_large.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="container mx-auto relative z-20 flex flex-col items-center text-center px-6 max-w-7xl">
          <div className="overflow-hidden mb-6">
             <span className="text-[11px] font-black uppercase tracking-[0.8em] text-[#C5A059] block animate-in slide-in-from-bottom-full duration-1000">The Alchemic Heritage</span>
          </div>
          <h1 className="text-7xl md:text-9xl lg:text-[160px] font-serif text-white font-black leading-[0.8] uppercase mb-12 animate-in fade-in zoom-in-95 duration-1000 delay-200 tracking-tighter">
            Jabal <br />
            <span className="italic text-[#C5A059]">Toubkal</span>
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-white/50 tracking-[0.2em] font-serif italic leading-loose mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
             Rare botanicals, curated spices, and restorative <br />
             minerals from the heart of the High Atlas.
          </p>
          <div className="flex flex-wrap justify-center gap-10 animate-in fade-in duration-1000 delay-700">
            <Link href="/products" className="group relative bg-[#C5A059] px-20 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-black transition-all hover:bg-white flex items-center gap-6 shadow-2xl">
              Unveil Collection
              <FaArrowRightLong className="group-hover:translate-x-4 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
           <div className="flex flex-col items-center gap-4 text-[#C5A059]/40">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr]">Scroll</span>
              <div className="w-[1px] h-20 bg-gradient-to-b from-[#C5A059] to-transparent animate-pulse" />
           </div>
        </div>
      </section>

      {/* 🟠 The Ritual Path - Bundles */}
      <section className="py-48 container mx-auto px-6 lg:px-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-serif italic text-foreground/[0.02] pointer-events-none select-none">Rituals</div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-10">
          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="h-0.5 w-12 bg-[#C5A059]" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">Curated Collections</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-serif text-foreground font-black uppercase tracking-tight">Ajouter au <span className="italic text-[#C5A059]">Panier</span></h2>
             <p className="text-foreground/40 max-w-xl font-serif italic text-lg leading-relaxed italic">Complete experiences designed for the modern alchemist.</p>
          </div>
          <Link href="/bundles" className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059] pb-4 border-b border-[#C5A059]/20 hover:border-[#C5A059] transition-all">
             The Full Archives
             <FaArrowRightLong className="group-hover:translate-x-4 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 max-w-[1400px] mx-auto">
          {bundles.length > 0 ? bundles.map((bundle: any) => (
            <Link key={bundle.id} href={`/bundles/${bundle.id}`} className="group flex flex-col gap-10 hover:-translate-y-4 transition-all duration-700">
              <div className="relative w-full aspect-[4/5] overflow-hidden border border-[#C5A059]/10 p-2 bg-black shadow-2xl rounded-sm">
                <div className="relative w-full h-full overflow-hidden grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700">
                  <Image
                    src={getBundleImage(bundle.image)}
                    alt={bundle.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-8 bottom-8 z-20">
                   <BundleAddToCartButton bundle={bundle} />
                </div>
              </div>
              <div className="flex flex-col text-center space-y-4 px-6 flex-1">
                <div className="space-y-1">
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059]/50 italic block min-h-[1.5em]">Atlas Collection</span>
                   <h3 className="text-3xl font-serif text-foreground font-black uppercase tracking-tighter group-hover:text-[#C5A059] transition-colors line-clamp-1 min-h-[1.5em] flex items-center justify-center">{bundle.name}</h3>
                </div>
                <p className="text-base text-foreground/40 font-serif italic leading-relaxed line-clamp-2 min-h-[3rem]">
                  {bundle.description}
                </p>
                <div className="text-2xl font-serif font-black text-[#C5A059] pt-4 tabular-nums mt-auto">{parseFloat(bundle.price).toLocaleString()} MAD</div>
              </div>
            </Link>
          )) : (
            <div className="col-span-3 py-32 text-center border border-dashed border-[#C5A059]/10 rounded-sm">
              <span className="font-serif italic text-2xl text-foreground/20 uppercase tracking-widest">Gathering the elements for new rituels...</span>
            </div>
          )}
        </div>

        <div className="mt-24 flex justify-center">
          <Link href="/bundles" className="group relative border border-[#C5A059]/30 px-16 py-6 text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059] transition-all hover:bg-[#C5A059] hover:text-black flex items-center gap-6 shadow-2xl rounded-sm">
            Discover the Full Grimoire
            <FaArrowRightLong className="group-hover:translate-x-4 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 🟡 Best Sellers - Elixir Selection */}
      <section className="bg-card/40 py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-10">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <FaLeaf className="text-[#C5A059]" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]">Most Treasured</span>
               </div>
               <h3 className="text-5xl md:text-7xl font-serif text-foreground font-black uppercase tracking-tighter">Elite <span className="italic text-foreground/30">Selection</span></h3>
            </div>
            <Link href="/products" className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059] pb-4 border-b border-[#C5A059]/20 hover:border-[#C5A059] transition-all">
               The Full Vault
               <FaArrowRightLong className="group-hover:translate-x-4 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
            {bestSellers.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 🔵 The Narrative - Brand Story */}
      <section className="py-48 relative container mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32">
          <div className="lg:w-1/2 relative space-y-10 group">
             <div className="aspect-[4/5] relative rounded-sm overflow-hidden border border-[#C5A059]/10 p-2 bg-black shadow-2xl">
               <Image
                 src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488"
                 alt="Herbal Ritual"
                 fill
                 className="object-cover opacity-80 transition-transform duration-[5s] group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute bottom-12 left-12">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">High Atlas Sanctuary</span>
               </div>
             </div>
             <div className="absolute -bottom-16 -right-16 w-80 h-[500px] border border-[#C5A059]/10 hidden xl:block -z-10" />
          </div>
          <div className="lg:w-1/2 space-y-16">
            <div className="flex items-center gap-4">
               <FaScroll className="text-[#C5A059]" />
               <span className="text-xs font-black uppercase tracking-[0.6em] text-[#C5A059]">Legacy & Soul</span>
            </div>
            <h3 className="text-6xl md:text-8xl font-serif text-foreground leading-[0.85] font-black uppercase tracking-tighter">The Ritual <br /><span className="italic text-[#C5A059]">of Ancient</span> Herbs</h3>
            <p className="text-2xl text-foreground/70 font-serif italic leading-relaxed max-w-xl border-l-[4px] border-[#C5A059]/20 pl-10">
              &quot;In the heart of the High Atlas, every leaf tells a story of resilience, 
              sunlight, and ancient wisdom. We do not merely offer botanicals; we transmit 
              the ancestral soul of Morocco.&quot;
            </p>
            <Link href="/about" className="inline-flex items-center gap-8 bg-foreground text-background px-16 py-8 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#C5A059] hover:text-black transition-all rounded-sm shadow-2xl">
              Our Chronicles
              <FaArrowRightLong size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 🟣 The Chronicles - Recent Journal Entries */}
      <section className="py-48 bg-black/20">
         <div className="container mx-auto px-6 lg:px-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-10">
               <div className="space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">Recent Transmissions</span>
                  <h2 className="text-5xl md:text-7xl font-serif text-foreground font-black uppercase tracking-tighter">The Alchemic <span className="italic text-[#C5A059]">Journal</span></h2>
               </div>
               <Link href="/blog" className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059] pb-4 border-b border-[#C5A059]/20 hover:border-[#C5A059] transition-all">
                  The Complete Chronicles
                  <FaArrowRightLong className="group-hover:translate-x-4 transition-transform" />
               </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
               {blogs.map((blog) => (
                  <Link key={blog.id} href={`/blog/${blog.id}`} className="group space-y-10">
                     <div className="aspect-[16/10] relative overflow-hidden border border-[#C5A059]/10 p-1 bg-black rounded-sm group-hover:border-[#C5A059]/40 transition-all duration-700">
                        <Image src={getBlogImage(blog.image)} alt={blog.title} fill className="object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                        <div className="absolute bottom-6 left-6 inline-block bg-background/80 backdrop-blur-md border border-[#C5A059]/20 px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-[#C5A059]">
                           {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                     </div>
                     <div className="space-y-4 flex-1 flex flex-col">
                        <h4 className="text-3xl font-serif text-foreground uppercase font-black tracking-tight group-hover:text-[#C5A059] transition-colors leading-tight line-clamp-2 min-h-[4.5rem] flex items-center justify-center text-center">{blog.title}</h4>
                        <p className="text-base text-foreground/40 font-serif italic line-clamp-2 leading-relaxed min-h-[3rem] text-center mt-auto">{blog.excerpt}</p>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 📧 Subscription Ritual */}
      <NewsletterSection />
    </div>
  );
}
