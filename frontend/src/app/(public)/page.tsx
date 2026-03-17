import Image from "next/image";
import Link from "next/link";
import { getProducts, getRecipes, getBlogs } from "@/lib/api";
import { getRecipeImage, getBlogImage } from "@/lib/images";
import { FaLocationDot, FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa6";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  // Fetch data for home page
  let bestSellers: any[] = [];
  let recipes: any[] = [];
  let blogs: any[] = [];

  try {
    const [productsResult, recipesResult, blogsResult] = await Promise.all([
      getProducts({}).catch(() => []),
      getRecipes().catch(() => []),
      getBlogs().catch(() => []),
    ]);

    bestSellers = productsResult.filter((p: any) => p.best_seller).slice(0, 4);
    if (bestSellers.length < 4) {
      bestSellers = productsResult.slice(0, 4);
    }
    
    recipes = recipesResult.slice(0, 3);
    blogs = blogsResult.slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1509358271058-acd22cc93898"
            alt="Authentic Atlas Spices background"
            fill
            sizes="100vw"
            quality={75}
            className="object-cover opacity-60"
            priority
          />
        </div>
        
        <div className="container mx-auto relative z-20 flex flex-col items-start gap-10 lg:gap-12 px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground leading-[0.95] md:leading-[1.05]">
              Atlas <br />
              <span className="text-primary italic font-serif">Mountain</span>
            </h1>
            <div className="h-1 w-24 bg-primary rounded-full mt-2" />
          </div>
          <p className="max-w-2xl text-xl md:text-2xl text-foreground/80 leading-relaxed font-medium">
            Explore the authentic heritage of Moroccan botanicals. From sun-drenched valleys 
            to snow-capped peaks, we bring you the purest harvest from Jabal Toubkal.
          </p>
          <div className="flex flex-wrap gap-6 mt-6">
            <Link href="/products" className="rounded-full bg-primary px-10 py-5 text-xl font-black text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95">
              Explore Collection
            </Link>
            <Link href="/recipes" className="rounded-full border-2 border-foreground/10 bg-white/10 backdrop-blur-md px-10 py-5 text-xl font-bold transition-all hover:bg-white/20 hover:border-foreground/20 active:scale-95">
              View Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center mb-20">
          <div className="flex flex-col gap-2">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Curated Selection</span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Specialty Categories</h2>
          </div>
          <p className="text-foreground/80 text-lg max-w-3xl leading-relaxed font-semibold">From rare mountain herbs to ancient spice blends, explore our curated selection of Moroccan aromatics.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {[
            {
              name: "Whole Spices",
              img: "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a",
              count: "45 Items",
              color: "from-orange-950/90",
            },
            {
              name: "Ground Blends",
              img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
              count: "32 Items",
              color: "from-red-950/90",
            },
            {
              name: "Dried Herbs",
              img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
              count: "28 Items",
              color: "from-emerald-950/90",
            },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-[3rem] aspect-[4/5] bg-secondary/20 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 block"
            >
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/20 to-transparent p-10 flex flex-col justify-end gap-3`}>
                <span className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">{cat.count}</span>
                <h3 className="text-3xl font-bold text-white leading-tight">{cat.name}</h3>
                <span className="mt-4 inline-flex items-center text-white text-sm font-black uppercase tracking-widest border-b-2 border-white/0 hover:border-white transition-all w-fit py-1 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-500">
                   Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers Preview */}
      <section className="bg-secondary/15 py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-12 bg-primary rounded-full" />
                <span className="text-primary font-black uppercase tracking-widest text-xs">Community Favorites</span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight">Best Sellers</h2>
              <p className="text-foreground/80 text-lg max-w-xl font-semibold">Our community&apos;s favorite flavors, delivered to your kitchen with love and care.</p>
            </div>
            <Link href="/products" className="group flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm hover:gap-5 transition-all w-fit">
              View All Products
              <span className="text-xl">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {bestSellers.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Recipes Preview Section */}
      <section className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="h-0.5 w-12 bg-primary rounded-full" />
              <span className="text-primary font-black uppercase tracking-widest text-xs">Atlas Kitchen</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight">Quick Recipes</h2>
            <p className="text-foreground/80 text-lg max-w-xl font-semibold">Master the art of spices with our curated mountain-inspired recipes.</p>
          </div>
          <Link href="/recipes" className="group flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm hover:gap-5 transition-all w-fit mx-auto md:mx-0">
            Explore All Recipes
            <span className="text-xl">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {recipes.map((recipe: any) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group flex flex-col gap-6 overflow-hidden rounded-[2.5rem] bg-white border border-secondary/30 transition-all hover:shadow-2xl hover:-translate-y-2 block"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={getRecipeImage(recipe.image, recipe.title)}
                  alt={recipe.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 right-6 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2">
                  <span className="text-lg">⏱️</span> {recipe.cooking_time}
                </div>
              </div>
              <div className="flex flex-col gap-4 p-8 pt-2 text-left">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{recipe.title}</h3>
                <p className="text-foreground/80 line-clamp-2 text-sm leading-relaxed italic font-semibold font-serif">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-4 mt-4 pt-6 border-t border-secondary/30">
                  <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:tracking-[0.2em] transition-all">View Details</span>
                  <div className="h-0.5 w-8 bg-primary/20 group-hover:w-16 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section Preview */}
      <section className="container mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl skew-y-1 order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488"
              alt="Harvesting Atlas Herbs"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
          <div className="space-y-10 order-1 lg:order-2">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Our Heritage</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">Born in the <br /><span className="text-primary italic">High Atlas</span></h2>
            </div>
            <p className="text-foreground/70 text-xl leading-relaxed font-medium">
              At Herbes Jabal Toubkal, we source the finest aromatic treasures directly from the mountain cooperatives. 
              Our journey is one of tradition, respecting the ancient botanical wisdom that has thrived in Morocco for centuries.
            </p>
            <div className="space-y-6">
              {[
                { title: "Traditional Sourcing", desc: "Hand-harvested by local experts who know the land." },
                { title: "Natural Sun-Drying", desc: "Preserving the intense aromas through artisanal methods." }
              ].map((item) => (
                <div key={item.title} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-foreground/70 font-semibold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 text-center md:text-left">
              <Link href="/about" className="group flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm hover:gap-5 transition-all w-fit mx-auto md:mx-0">
                Discover Our Full Story
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="bg-secondary/15 py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-12 bg-primary rounded-full" />
                <span className="text-primary font-black uppercase tracking-widest text-xs">Heritage & Wisdom</span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight">Latest Stories</h2>
              <p className="text-foreground/80 text-lg max-w-xl font-semibold">Explore the secrets of traditional botanicals from the High Atlas.</p>
            </div>
            <Link href="/blog" className="group flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm hover:gap-5 transition-all w-fit">
              Read All Stories
              <span className="text-xl">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogs.map((blog: any) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.id}`}
                className="group flex flex-col gap-6 overflow-hidden rounded-3xl bg-white border border-secondary/30 transition-all hover:shadow-2xl hover:-translate-y-2 block"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={getBlogImage(blog.image)}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col gap-3 p-8 pt-2 text-left">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-foreground/80 line-clamp-3 text-sm leading-relaxed font-medium">
                    {blog.excerpt || "Dive deep into the heritage and culinary secrets of Moroccan Atlas mountain botanicals..."}
                  </p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-secondary">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Read More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl shadow-secondary/20 border border-secondary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Reach Out</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Let&apos;s Connect</h2>
              <p className="text-foreground/80 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Whether you have a question about our products or want to share your culinary creations, 
                we&apos;re here to listen and help.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/contact" className="rounded-full bg-primary px-12 py-5 text-xl font-black text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95">
                Send a Message
              </Link>
              <a 
                href="https://wa.me/+212607790956" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full border-2 border-primary/20 bg-primary/5 px-12 py-5 text-xl font-black text-primary transition-all hover:bg-primary/10 active:scale-95 flex items-center gap-3"
              >
                <FaWhatsapp className="text-2xl" />
                Chat on WhatsApp
              </a>
            </div>
            <div className="pt-10 flex flex-wrap justify-center gap-12 text-sm font-bold text-foreground/40 uppercase tracking-widest">
              <div className="flex items-center gap-3 bg-secondary/10 px-6 py-3 rounded-2xl hover:bg-secondary/20 transition-all">
                <FaLocationDot className="text-primary text-lg" />
                <span>Marrakech, Morocco</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/10 px-6 py-3 rounded-2xl hover:bg-secondary/20 transition-all">
                <FaPhone className="text-primary text-lg" />
                <span>+212 524308038</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/10 px-6 py-3 rounded-2xl hover:bg-secondary/20 transition-all">
                <FaEnvelope className="text-primary text-lg" />
                <span>contact@herbesjabaltoubkal.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
