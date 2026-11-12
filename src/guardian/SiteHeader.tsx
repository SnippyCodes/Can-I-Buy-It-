import type { ReactNode } from "react";
import { href } from "./router";
import { BrandMark } from "./icons";

type NavKey = "home" | "storefront" | "copilot";

const NAV: { key: NavKey; label: string; to: string }[] = [
  { key: "storefront", label: "Storefront", to: href.storefront },
  { key: "copilot", label: "Copilot", to: href.copilot },
];

export function Brand() {
  return (
    <a href={href.home} className="flex shrink-0 items-center gap-2.5" aria-label="Can I Buy It? home">
      <BrandMark size={26} />
      <span className="text-[14px] font-semibold tracking-[-0.015em] text-zinc-50">
        Can I Buy It?
      </span>
    </a>
  );
}

export function SiteHeader({
  active,
  center,
  right,
}: {
  active: NavKey;
  center?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-6">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={item.to}
              aria-current={active === item.key ? "page" : undefined}
              className={`rounded-[7px] px-2.5 py-1.5 text-[13px] ${
                active === item.key ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 justify-center">{center}</div>
        <div className="flex shrink-0 items-center gap-2.5">{right}</div>
      </div>
    </header>
  );
}
