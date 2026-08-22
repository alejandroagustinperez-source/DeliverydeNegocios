import Link from "next/link";
import { Icon } from "./icons";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-3.5 flex items-center gap-1.5 text-[13px] text-ink-soft">
      <Link href="/" className="hover:text-brand-blue hover:underline">
        Inicio
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <Icon name="arrow" className="w-2.5 h-2.5" strokeWidth={2.5} />
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-blue hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
