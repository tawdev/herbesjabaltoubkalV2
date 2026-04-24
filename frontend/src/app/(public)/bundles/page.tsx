import { getBundles } from "@/lib/api";
import { getBundleImage } from "@/lib/images";
import Link from "next/link";
import Image from "next/image";
import BundleAddToCartButton from "@/components/BundleAddToCartButton";

export const dynamic = 'force-dynamic';

export default async function BundlesPage() {
  let bundles: any[] = [];
  try {
    bundles = await getBundles();
  } catch (error) {
    console.error("Failed to fetch bundles:", error);
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header Area */}
      <section className="py-24 border-b border-[#C5A059]/10 relative overflow-hidden">
        {/* Background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] font-serif italic text-foreground/[0.02] pointer-events-none select-none whitespace-nowrap">
           Ritual Packs
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 text-center space-y-6 relative z-10">
          <span className="text-[#C5A059] font-bold uppercase tracking-[0.5em] text-[10px]">Curated Collections</span>
          <h1 className="text-5xl md:text-7xl font-serif text-[#C5A059] uppercase tracking-tighter">
            Parcours <span className="text-foreground/20 italic lowercase">Rituel</span>
          </h1>
          <p className="max-w-xl mx-auto text-foreground/40 font-serif italic">
            Complete alchemic experiences designed to elevate your daily ceremonies.
          </p>
        </div>
      </section>

      {/* Grid Area */}
      <section className="container mx-auto px-6 lg:px-12 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          {bundles.length > 0 ? (
             bundles.map((bundle: any) => (
               <Link key={bundle.id} href={`/bundles/${bundle.id}`} className="group flex flex-col gap-10 hover:-translate-y-2 transition-all duration-700">
                 <div className="relative w-full aspect-[4/5] overflow-hidden border border-[#C5A059]/10 p-2 bg-black shadow-2xl rounded-sm">
                   <div className="relative w-full h-full overflow-hidden grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700">
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

                 <div className="flex flex-col text-center px-4 space-y-4 flex-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059]/50 italic block min-h-[1.5em]">
                       Atlas Collection
                    </span>
                    <h2 className="text-3xl font-serif text-foreground font-black uppercase tracking-tight group-hover:text-[#C5A059] transition-colors leading-tight line-clamp-1 min-h-[1.5em] flex items-center justify-center">
                       {bundle.name}
                    </h2>
                    <h3 className="text-xl font-serif text-[#C5A059]/50 font-black font-arabic min-h-[1.5em] flex items-center justify-center" dir="rtl">
                       {bundle.name_ar}
                    </h3>
                    
                    <p className="text-base text-foreground/40 font-serif italic leading-relaxed line-clamp-2 min-h-[3rem]">
                      {bundle.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-[#C5A059]/10 flex flex-col items-center">
                      <div className="flex items-center justify-center">
                         <span className="text-3xl font-serif font-black text-[#C5A059] tabular-nums">
                            {parseFloat(bundle.price).toLocaleString()}
                         </span>
                         <span className="text-[10px] uppercase font-black tracking-widest text-[#C5A059]/50 ml-2">MAD</span>
                      </div>
                    </div>
                 </div>
               </Link>
             ))
          ) : (
            <div className="col-span-full py-40 text-center border border-dashed border-[#C5A059]/20">
              <span className="font-serif italic text-2xl text-foreground/20 uppercase tracking-widest">
                No Rituals found in the archives.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
