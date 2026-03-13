import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd0544?auto=format&fit=crop&q=80&w=2000"
            alt="Spices background"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        
        <div className="container relative z-20 flex flex-col items-start gap-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground">
            Aromatic <br />
            <span className="text-primary italic font-serif">Treasures</span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl text-foreground/80 leading-relaxed">
            Discover a world of vibrant colors and intense flavors. Our spices are ethically sourced 
            and naturally processed to bring the soul of every dish to life.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="/products" className="rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90">
              Explore Collection
            </a>
            <a href="/recipes" className="rounded-full border bg-background/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold transition-all hover:bg-background/80">
              View Recipes
            </a>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Specialty Categories</h2>
          <p className="text-foreground/60 max-w-2xl">From earthy herbs to fiery ground spices, explore our curated selection of fine aromatics.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Whole Spices", img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800", count: "45 Items" },
            { name: "Ground Blends", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd0544?auto=format&fit=crop&q=80&w=800", count: "32 Items" },
            { name: "Dried Herbs", img: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&q=80&w=800", count: "28 Items" },
          ].map((cat) => (
            <div key={cat.name} className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-secondary/20">
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <span className="text-white/60 text-sm font-medium">{cat.count}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{cat.name}</h3>
                <a href={`/products?category=${cat.name.toLowerCase()}`} className="mt-4 text-white text-sm font-semibold underline underline-offset-4 opacity-0 transition-opacity group-hover:opacity-100">
                  Shop Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Preview */}
      <section className="bg-secondary/30 py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Best Sellers</h2>
              <p className="text-foreground/60">Our community's favorite flavors, delivered to your kitchen.</p>
            </div>
            <a href="/products" className="text-primary font-semibold hover:underline">View All Products</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* We will map over actual products here later */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group flex flex-col gap-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="absolute top-4 left-4 z-10 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                    Best Seller
                  </div>
                  <Image
                    src={`https://images.unsplash.com/photo-1596040033229-a9821ebd0544?auto=format&fit=crop&q=80&w=400&index=${i}`}
                    alt="Product item"
                    fill
                    className="object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                  />
                  <button className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-primary text-primary-foreground opacity-0 transition-all hover:scale-110 group-hover:opacity-100 flex items-center justify-center shadow-lg">
                    +
                  </button>
                </div>
                <div className="flex flex-col items-center text-center px-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Premium Spices {i}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-secondary-foreground/60">
                    <span>100g</span>
                    <span>•</span>
                    <span className="text-yellow-500">★★★★★</span>
                  </div>
                  <span className="mt-2 font-bold text-lg text-primary">25.00 MAD</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
