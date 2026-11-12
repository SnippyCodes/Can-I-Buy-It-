import type { ReactNode } from "react";
import { GuardianMark } from "../guardian/brand";
import { GitHubIcon } from "../guardian/icons";
import { href } from "../guardian/router";

type NavKey = "home" | "storefront";

export function BrandLockup() {
  return (
    <a href={href.home} className="flex shrink-0 items-center gap-2.5" aria-label="Can I Buy It? home">
      <GuardianMark size={30} />
      <span className="flex flex-col leading-none">
        <span className="text-[14px] font-semibold tracking-[-0.015em] text-zinc-50">Can I Buy It?</span>
        <span className="mt-[3px] text-[10.5px] text-zinc-500">Guardian Copilot</span>
      </span>
    </a>
  );
}

export function Header({
  active,
  center,
  right,
}: {
  active: NavKey;
  center?: ReactNode;
  right?: ReactNode;
}) {
  const nav: { key: NavKey | "copilot"; label: string; to: string }[] = [
    { key: "home", label: "Product", to: href.home },
    { key: "storefront", label: "Storefront", to: href.storefront },
    { key: "copilot", label: "Copilot", to: href.copilot },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center gap-6 px-6">
        <BrandLockup />
        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
          {nav.map((n) => (
            <a
              key={n.key}
              href={n.to}
              aria-current={active === n.key ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                active === n.key ? "bg-white/[0.06] text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 justify-center">{center}</div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={href.repo}
            target="_blank"
            rel="noreferrer"
            className="grid size-9 place-items-center rounded-full text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 max-sm:hidden"
            aria-label="View source on GitHub"
          >
            <GitHubIcon width={17} height={17} />
          </a>
          {right}
        </div>
      </div>
    </header>
  );
}
