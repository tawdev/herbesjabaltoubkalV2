import Image from "next/image";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  // Fetch real best-seller products
  let bestSellers: any[] = [];
  try {
    const allProducts = await getProducts({});
    bestSellers = allProducts.filter((p: any) => p.best_seller).slice(0, 4);
    if (bestSellers.length < 4) {
      bestSellers = allProducts.slice(0, 4);
    }
  } catch {
    bestSellers = [];
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
            <a href="/products" className="rounded-full bg-primary px-10 py-5 text-xl font-black text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95">
              Explore Collection
            </a>
            <a href="/recipes" className="rounded-full border-2 border-foreground/10 bg-white/10 backdrop-blur-md px-10 py-5 text-xl font-bold transition-all hover:bg-white/20 hover:border-foreground/20 active:scale-95">
              View Recipes
            </a>
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
            <a
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
            </a>
          ))}
        </div>
      </section>

      {/* About Section Preview */}
      <section className="container mx-auto px-6 lg:px-8 py-10 mt-10">
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
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">Born in the <br /><span className="text-primary italic font-serif">High Atlas</span></h2>
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
            <div className="pt-6">
              <a href="/about" className="group flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm hover:gap-5 transition-all w-fit">
                Discover Our Full Story
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Preview — real products */}
      <section className="bg-secondary/15 py-32 mt-10">
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
            <a href="/products" className="group flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm hover:gap-5 transition-all w-fit">
              View All Products
              <span className="text-xl">→</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {bestSellers.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
