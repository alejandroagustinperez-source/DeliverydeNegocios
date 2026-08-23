"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "./icons";
import { useCart } from "./CartProvider";

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-brand-blue-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center gap-5 px-6 py-3.5 flex-wrap">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-chasqui-blanco.png"
            alt="Chasqui"
            width={140}
            height={46}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <form action="/buscar" method="GET" className="flex-1 min-w-[220px] flex bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            name="q"
            placeholder="Buscar rubros, locales o productos..."
            className="flex-1 px-3.5 py-2.5 text-sm outline-none"
          />
          <button type="submit" className="bg-accent px-4 flex items-center text-white">
            <Icon name="search" className="w-4 h-4" />
          </button>
        </form>

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
