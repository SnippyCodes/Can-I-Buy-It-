import { useMemo, useState } from "react";
import { evaluatePurchase, getPersona, RESERVE_FLOOR, usd, type Verdict } from "../guardian/evaluate";
import { ImageIcon, SearchIcon, ShieldIcon, SparkIcon } from "../guardian/icons";
import { PersonaMenu } from "../guardian/PersonaMenu";
import { href } from "../guardian/router";
import { SiteHeader } from "../guardian/SiteHeader";
import { btn, eyebrow } from "../guardian/ui";
import { bestOffer, categories, offerTotal, products, type CategoryId } from "./catalog";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "headroom";

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "headroom", label: "Most headroom" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

const VERDICT_ORDER: Verdict[] = ["safe", "payIn4", "blocked"];
const VERDICT_LABEL: Record<Verdict, string> = {
  safe: "Safe in full",
  payIn4: "Pay in 4",
  blocked: "Blocked",
};
const VERDICT_BAR: Record<Verdict, string> = {
  safe: "bg-gain",
  payIn4: "bg-caution",
  blocked: "bg-loss",
};

export function StorefrontPage({
  personaId,
  onPersonaChange,
}: {
  personaId: string;
  onPersonaChange: (id: string) => void;
}) {
  const persona = getPersona(personaId);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [hideBlocked, setHideBlocked] = useState(false);

  const evaluated = useMemo(
    () =>
      products.map((p) => {
        const total = offerTotal(bestOffer(p));
        return { product: p, total, evaluation: evaluatePurchase(total, persona.balance) };
      }),
    [persona.balance],
  );

  const counts = useMemo(() => {
    const c: Record<Verdict, number> = { safe: 0, payIn4: 0, blocked: 0 };
    evaluated.forEach((e) => c[e.evaluation.verdict]++);
    return c;
  }, [evaluated]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = evaluated.filter(({ product, evaluation }) => {
      if (category !== "all" && product.category !== category) return false;
      if (hideBlocked && evaluation.verdict === "blocked") return false;
      if (!q) return true;
      return `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(q);
    });
    if (sort === "price-asc") list.sort((a, b) => a.total - b.total);
    if (sort === "price-desc") list.sort((a, b) => b.total - a.total);
    if (sort === "headroom")
      list.sort(
        (a, b) =>
          VERDICT_ORDER.indexOf(a.evaluation.verdict) - VERDICT_ORDER.indexOf(b.evaluation.verdict) ||
          a.total - b.total,
      );
    return list;
  }, [evaluated, query, category, sort, hideBlocked]);

  const safeCeiling = Math.max(persona.balance - RESERVE_FLOOR, 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader
        active="storefront"
        center={
          <label className="relative hidden w-full max-w-[460px] lg:block">
            <span className="sr-only">Search products</span>
            <SearchIcon
              width={15}
              height={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 100M+ products across 25,000+ stores"
              className="h-9 w-full rounded-[9px] border border-zinc-800 bg-zinc-925 pr-10 pl-9 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
            />
            <span
              className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-[6px] text-zinc-500"
              title="Image search runs on Channel3 in the full app"
            >
              <ImageIcon width={14} height={14} />
            </span>
          </label>
        }
        right={
          <>
            <PersonaMenu personaId={personaId} onChange={onPersonaChange} />
            <a href={href.copilot} className={`${btn.primary} h-9 px-3.5 text-[12.5px] max-sm:hidden`}>
              <SparkIcon width={14} height={14} />
              Ask Copilot
            </a>
          </>
        }
      />

      <main className="mx-auto max-w-[1280px] px-6 pt-10 pb-24">
        <section className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-end">
          <div>
            <p className={eyebrow}>Channel3 live discovery</p>
            <h1 className="mt-3 max-w-[18ch] text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-zinc-50">
              Every price, checked against your floor.
            </h1>
            <p className="mt-4 max-w-[520px] text-[14px] leading-[1.6] text-zinc-400">
              Guardian models each item against {persona.name}&rsquo;s sandbox balance before you see
              a Buy button. Nothing is charged until you approve it.
            </p>
          </div>

          <div className="rounded-[14px] border border-zinc-800 bg-zinc-925 p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12px] font-medium text-zinc-200">
                <ShieldIcon width={14} height={14} className="text-zinc-400" />
                Guardian buying power
              </span>
              <span className="text-[11px] text-zinc-500">{persona.label}</span>
            </div>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
              <span className="text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-zinc-50">
                {usd(safeCeiling)}
              </span>
              <span className="text-[12px] text-zinc-500">spendable above the $500 floor</span>
            </p>
            <div className="mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
              {VERDICT_ORDER.map((v) =>
                counts[v] ? (
                  <span key={v} className={VERDICT_BAR[v]} style={{ flex: counts[v] }} />
                ) : null,
              )}
            </div>
            <div className="mt-3 flex gap-4 text-[11.5px]">
              {VERDICT_ORDER.map((v) => (
                <span key={v} className="flex items-center gap-1.5 text-zinc-400">
                  <span className={`size-1.5 rounded-full ${VERDICT_BAR[v]}`} />
                  <span className="tabular-nums text-zinc-100">{counts[v]}</span> {VERDICT_LABEL[v]}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="sticky top-16 z-30 -mx-6 mt-10 border-y border-zinc-800/80 bg-zinc-950/85 px-6 py-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="scroll-thin -my-1 flex min-w-0 flex-1 basis-full gap-1.5 overflow-x-auto py-1 sm:basis-0">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={`h-8 shrink-0 rounded-full px-3.5 text-[12.5px] font-medium transition-colors ${
                    category === c.id
                      ? "bg-zinc-50 text-zinc-950"
                      : "border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-zinc-300 select-none">
              <button
                type="button"
                role="switch"
                aria-checked={hideBlocked}
                onClick={() => setHideBlocked((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors ${hideBlocked ? "bg-zinc-50" : "bg-zinc-800"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-4 rounded-full transition-transform ${
                    hideBlocked ? "translate-x-4 bg-zinc-950" : "bg-zinc-400"
                  }`}
                />
              </button>
              Hide blocked
            </label>

            <label className="relative">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-8 appearance-none rounded-[8px] border border-zinc-800 bg-zinc-925 pr-8 pl-3 text-[12.5px] text-zinc-200 focus:border-zinc-600 focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[10px] text-zinc-500">
                ▾
              </span>
            </label>
          </div>
          <label className="relative mt-3 block lg:hidden">
            <span className="sr-only">Search products</span>
            <SearchIcon
              width={15}
              height={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="h-9 w-full rounded-[9px] border border-zinc-800 bg-zinc-925 pr-3 pl-9 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <p className="text-[12.5px] text-zinc-500">
            <span className="tabular-nums text-zinc-200">{visible.length}</span> results
            {query && (
              <>
                {" "}
                for <span className="text-zinc-200">&ldquo;{query}&rdquo;</span>
              </>
            )}
          </p>
          <p className="hidden text-[11.5px] text-zinc-500 sm:block">
            Prices include shipping from the cheapest in-stock store
          </p>
        </div>

        {visible.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visible.map(({ product }) => (
              <ProductCard key={product.id} product={product} balance={persona.balance} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center rounded-[14px] border border-dashed border-zinc-800 px-6 py-20 text-center">
            <SearchIcon width={20} height={20} className="text-zinc-600" />
            <p className="mt-4 text-[14px] font-medium text-zinc-200">Nothing matches these filters</p>
            <p className="mt-1 max-w-[340px] text-[12.5px] text-zinc-500">
              {hideBlocked
                ? `Everything here is blocked for ${persona.name}. Show blocked items or switch persona.`
                : "Try a different search or category."}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setHideBlocked(false);
              }}
              className={`${btn.secondary} mt-5 h-8 px-3.5 text-[12.5px]`}
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
