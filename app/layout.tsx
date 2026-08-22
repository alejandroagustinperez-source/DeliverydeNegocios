import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Marketplace SL — Delivery de repuestos en San Luis",
  description:
    "Comprá en los comercios de San Luis y recibí tu pedido el mismo día. Empezamos por repuestos de auto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-bg text-ink font-sans">
        <CartProvider>
          <Header />
          {children}
          <p className="max-w-6xl mx-auto px-6 pb-8 text-xs text-ink-soft text-center">
            MVP de referencia — rubros, locales, catálogo, horarios y precios son datos de ejemplo.
          </p>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
