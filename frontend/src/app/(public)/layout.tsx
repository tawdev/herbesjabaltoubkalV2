import Header from "@/components/Header";
import WhatsappContact from "@/components/WhatsappContact";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <WhatsappContact />
      <main className="flex-1">{children}</main>

      <footer className="border-t bg-secondary/20 py-24 mt-24">
        <div className="container mx-auto px-6 lg:px-8 grid gap-16 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-primary italic font-serif">Herbes Jabal Toubkal</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Pure Atlas Botanicals</span>
            </div>
            <p className="max-w-md text-base text-foreground/70 leading-relaxed font-medium">
              Sourcing the finest aromatic treasures from the High Atlas. 
              We bring ethically harvested, naturally sun-dried herbs and 
              premium spices straight from Morocco to your kitchen.
            </p>
            <div className="flex gap-5">
              {[
                { name: "Instagram", icon: "IG" },
                { name: "Facebook", icon: "FB" },
                { name: "Twitter", icon: "X" }
              ].map((social) => (
                <div 
                  key={social.name} 
                  aria-label={`Follow us on ${social.name}`}
                  role="button"
                  className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all border border-secondary text-[10px] font-black"
                >
                  {social.icon}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-8">Discover</h3>
            <ul className="space-y-5 text-sm font-bold text-foreground/80">
              <li><a href="/products" className="hover:text-primary transition-colors">Aromatic Spices</a></li>
              <li><a href="/recipes" className="hover:text-primary transition-colors">Culinary Recipes</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="/shipping" className="hover:text-primary transition-colors">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-8">Support</h3>
            <ul className="space-y-5 text-sm font-bold text-foreground/80">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-foreground/70 font-black">Email Us</span>
                <span className="hover:text-primary transition-colors cursor-pointer">contact@herbesjabaltoubkal.com</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-foreground/70 font-black">Call Us</span>
                <span className="hover:text-primary transition-colors cursor-pointer">+212 524308038</span>
              </li>
              <li>Live Chat: 9AM - 6PM</li>
              <li>FAQ Center</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 lg:px-8 mt-24 border-t border-border/40 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-foreground/70 font-bold tracking-wide">
          <p>© 2026 <a href="https://cdigital.ma/" target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110 transition-all">cdigital</a>. Authentic Moroccan Heritage.</p>
          <div className="flex gap-10">
            <a href="/privacy" className="hover:text-foreground transition-all">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-all">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
