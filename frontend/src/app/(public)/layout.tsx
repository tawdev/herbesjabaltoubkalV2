import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWhatsapp from "@/components/ClientWhatsapp";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ClientWhatsapp />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
