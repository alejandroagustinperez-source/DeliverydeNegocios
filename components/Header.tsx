"use client";

import Link from "next/link";
import { Icon } from "./icons";
import { useCart } from "./CartProvider";

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-brand-blue-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center gap-5 px-6 py-3.5 flex-wrap">
        <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-xl shrink-0">
          <span className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
            <Icon name="store" className="w-4 h-4 text-accent" />
          </span>
          Marketplace<span className="text-accent">SL</span>
        </Link>

        <div className="flex-1 min-w-[220px] flex bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Buscar rubros, locales o productos..."
            className="flex-1 px-3.5 py-2.5 text-sm outline-none"
          />
          <button className="bg-accent px-4 flex items-center text-white">
            <Icon name="search" className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[13px] text-white/70 whitespace-nowrap">
          <Icon name="pin" className="w-3.5 h-3.5" />
          Enviando a <b className="text-white">San Luis Capital</b>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-white/10 border border-white/25 text-white text-[13px] font-semibold px-3.5 py-2.5 rounded-lg hover:bg-white/20 transition"
        >
          <Icon name="cart" className="w-4 h-4" />
          Carrito
          <span className="bg-accent rounded-full w-[18px] h-[18px] text-[11px] flex items-center justify-center">
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
