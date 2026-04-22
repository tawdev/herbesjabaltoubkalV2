"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWhatsapp from "@/components/ClientWhatsapp";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAuthPage && <Header />}
      {!isAuthPage && <ClientWhatsapp />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
