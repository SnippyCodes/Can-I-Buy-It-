import { useMemo, useState, type ReactNode } from "react";
import { PartnerMark } from "../../guardian/brand";
import {
  evaluatePurchase,
  getPersona,
  PAY_IN_4_MAX,
  PAY_IN_4_MIN,
  RESERVE_FLOOR,
  usd,
  verdictTone,
  type Verdict,
} from "../../guardian/evaluate";
import { ArrowRightIcon, FilterIcon, ImageIcon, SearchIcon, ShieldIcon, SparkIcon } from "../../guardian/icons";
import { PersonaMenu } from "../../guardian/PersonaMenu";
import { href, scrollToId } from "../../guardian/router";
import { btn } from "../../guardian/ui";
import { VerdictBadge } from "../../guardian/VerdictBadge";
import { bestOffer, categories, getProduct, heroImage, offerTotal, products, type CategoryId } from "../../storefront/catalog";
import { Header } from "../Header";
import { ProductTile } from "./ProductTile";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const LANES: { verdict: Verdict; title: string; body: string }[] = [
  { verdict: "safe", title: "Safe to buy today", body: "Pay in full and stay above the floor." },
  { verdict: "payIn4", title: "Smarter with Pay in 4", body: "Too much upfront, safe across four payments." },
  { verdict: "blocked", title: "Guardian says wait", body: "Either option would cross the $500 floor." },
];

const MAX_PRICE = 2000;
const merchants = Array.from(new Set(products.flatMap((p) => p.offers.map((o) => o.merchant)))).sort();

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-zinc-800 pt-5">
      <legend className="mb-3 text-[12px] font-medium text-zinc-200">{title}</legend>
      <div className="flex flex-col gap-2">{children}</div>
    </fieldset>
  );
}

function Check({
  checked,
  onChange,
  children,
  type = "checkbox",
  name,
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  type?: "checkbox" | "radio";
  name?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-zinc-400 hover:text-zinc-100">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`grid size-4 shrink-0 place-items-center border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-500 ${
          type === "radio" ? "rounded-full" : "rounded-[4px]"
        } ${checked ? "border-zinc-50 bg-zinc-50" : "border-zinc-700"}`}
      >
        {checked && <span className={`size-1.5 bg-zinc-950 ${type === "radio" ? "rounded-full" : "rounded-[1px]"}`} />}
      </span>
      <span className={`flex flex-1 items-center justify-between gap-2 ${checked ? "text-zinc-100" : ""}`}>{children}</span>
    </label>
  );
}

export function StorefrontV2({
  personaId,
  onPersonaChange,
}: {
  personaId: string;
  onPersonaChange: (id: string) => void;
}) {
  const persona = getPersona(personaId);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const [verdicts, setVerdicts] = useState<Set<Verdict>>(new Set());
  const [stores, setStores] = useState<Set<string>>(new Set());
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<Sort>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const rows = useMemo(
    () =>
      products.map((p) => {
        const total = offerTotal(bestOffer(p));
        return { product: p, total, evaluation: evaluatePurchase(total, persona.balance) };
      }),
    [persona.balance],
  );

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ product }) => {
      if (category !== "all" && product.category !== category) return false;
      return !q || `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(q);
    });
  }, [rows, query, category]);

  const grid = useMemo(() => {
    const list = searched.filter(({ product, total, evaluation }) => {
      if (verdicts.size && !verdicts.has(evaluation.verdict)) return false;
      if (stores.size && !product.offers.some((o) => stores.has(o.merchant))) return false;
      return maxPrice >= MAX_PRICE || total <= maxPrice;
    });
    if (sort === "price-asc") list.sort((a, b) => a.total - b.total);
    if (sort === "price-desc") list.sort((a, b) => b.total - a.total);
    if (sort === "rating") list.sort((a, b) => b.product.rating - a.product.rating);
    return list;
  }, [searched, verdicts, stores, maxPrice, sort]);

  const counts = useMemo(() => {
    const c: Record<Verdict, number> = { safe: 0, payIn4: 0, blocked: 0 };
    rows.forEach((r) => c[r.evaluation.verdict]++);
    return c;
  }, [rows]);

  const activeFilters = verdicts.size + stores.size + (maxPrice < MAX_PRICE ? 1 : 0);
  const spendable = Math.max(persona.balance - RESERVE_FLOOR, 0);
  // Highest price Guardian would approve by any route: full payment, or Pay in 4 when eligible.
  const splitCeiling = Math.min(spendable * 4, PAY_IN_4_MAX);
  const approvable = Math.max(spendable, splitCeiling >= PAY_IN_4_MIN ? splitCeiling : 0);
  const featured = getProduct("court-low-leather")!;
  const featuredEval = evaluatePurchase(offerTotal(bestOffer(featured)), persona.balance);

  const toggle = <T,>(set: Set<T>, v: T) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };
  const clearAll = () => {
    setVerdicts(new Set());
    setStores(new Set());
    setMaxPrice(MAX_PRICE);
    setQuery("");
    setCategory("all");
  };

  const searchInput = (id: string, className: string) => (
    <label htmlFor={id} className={`relative ${className}`}>
      <span className="sr-only">Search products</span>
      <SearchIcon width={15} height={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500" />
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search 100M+ products, or drop an image"
        className="h-10 w-full rounded-full border border-zinc-800 bg-zinc-925 pr-11 pl-10 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
      />
      <span
        title="Image search runs on Channel3 in the full app"
        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-500"
      >
        <ImageIcon width={15} height={15} />
      </span>
    </label>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header
        active="storefront"
        center={searchInput("search-desktop", "hidden w-full max-w-[440px] lg:block")}
        right={
          <>
            <PersonaMenu personaId={personaId} onChange={onPersonaChange} />
            <a href={href.copilot} className={`${btn.primary} h-9 rounded-full px-4 text-[12.5px] max-sm:hidden`}>
              <SparkIcon width={14} height={14} />
              Ask Copilot
            </a>
          </>
        }
      />

      {/* Category bar */}
      <div className="sticky top-[60px] z-30 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-6">
          <nav aria-label="Categories" className="scroll-thin flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`relative h-11 shrink-0 px-3 text-[13px] transition-colors ${
                  category === c.id ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {c.label}
                {category === c.id && <span className="absolute inset-x-3 bottom-0 h-px bg-zinc-50" />}
              </button>
            ))}
          </nav>
          <span className="hidden items-center gap-2 text-[11.5px] text-zinc-500 sm:flex">
            <PartnerMark partner="channel3" size={14} /> Live on Channel3
            <span className="text-zinc-700">·</span>
            <PartnerMark partner="paypal" size={14} /> PayPal Sandbox
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-6 pt-8 pb-28">
        {searchInput("search-mobile", "mb-6 block lg:hidden")}

        {/* Banner */}
        <section className="grid overflow-hidden rounded-[24px] border border-zinc-800 bg-zinc-925 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex flex-col p-8 sm:p-10">
            <p className="flex items-center gap-2 text-[12px] text-zinc-500">
              <ShieldIcon width={14} height={14} /> Guardian-checked storefront
            </p>
            <h1 className="mt-4 text-[clamp(34px,4.4vw,52px)] leading-[0.98] font-semibold tracking-[-0.045em] text-zinc-50">
              Shop the drop.
              <br />
              <span className="text-zinc-500">Keep the floor.</span>
            </h1>
            <p className="mt-5 max-w-[420px] text-[14px] leading-[1.65] text-zinc-400">
              Prices from 25,000+ retailers, each checked against {persona.name}&rsquo;s PayPal balance before
              you ever see a checkout button.
            </p>

            <div className="mt-8 rounded-[16px] border border-zinc-800 bg-zinc-950/60 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] text-zinc-500">Spendable above the $500 floor</span>
                <span className="text-[11.5px] text-zinc-500">{persona.label}</span>
              </div>
              <p className="mt-1 text-[32px] font-semibold tabular-nums tracking-[-0.03em] text-zinc-50">{usd(spendable)}</p>
              <div className="mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                {LANES.map((l) =>
                  counts[l.verdict] ? (
                    <span key={l.verdict} className={verdictTone[l.verdict].dot} style={{ flex: counts[l.verdict] }} />
                  ) : null,
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-zinc-400">
                {LANES.map((l) => (
                  <button
                    key={l.verdict}
                    type="button"
                    onClick={() => scrollToId(`lane-${l.verdict}`)}
                    className="flex items-center gap-1.5 hover:text-zinc-100"
                  >
                    <span className={`size-1.5 rounded-full ${verdictTone[l.verdict].dot}`} />
                    <span className="tabular-nums text-zinc-100">{counts[l.verdict]}</span> {l.title.replace(" today", "")}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button type="button" onClick={() => scrollToId("lane-safe")} className={`${btn.primary} h-10 rounded-full px-5 text-[13px]`}>
                Shop safe picks
              </button>
              <a href={href.home} className={`${btn.ghost} h-10 rounded-full px-4 text-[13px]`}>
                How Guardian decides
              </a>
            </div>
          </div>

          <div className="relative min-h-[360px] max-lg:border-t lg:border-l border-zinc-800">
            <img src={heroImage.src} alt={heroImage.alt} className="absolute inset-0 size-full object-cover text-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/70 via-transparent to-transparent" />
            <a
              href={href.product(featured.id)}
              className="absolute right-5 bottom-5 left-5 flex items-center gap-4 rounded-[16px] border border-white/10 bg-zinc-950/70 p-3.5 backdrop-blur-xl hover:border-white/20 sm:left-auto sm:w-[340px]"
            >
              <img src={featured.image} alt="" className="size-14 rounded-[10px] object-cover text-transparent" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-zinc-100">{featured.title}</span>
                <span className="mt-0.5 block text-[12px] tabular-nums text-zinc-400">
                  {usd(featuredEval.price, { cents: true })}
                </span>
                <span className="mt-1.5 block">
                  <VerdictBadge evaluation={featuredEval} />
                </span>
              </span>
              <ArrowRightIcon width={15} height={15} className="text-zinc-400" />
            </a>
          </div>
        </section>

        {/* Lanes */}
        {LANES.map((lane) => {
          const items = searched.filter((r) => r.evaluation.verdict === lane.verdict);
          return (
            <section key={lane.verdict} id={`lane-${lane.verdict}`} className="mt-16 scroll-mt-32">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2.5 text-[20px] font-semibold tracking-[-0.02em] text-zinc-50">
                    <span className={`size-2 rounded-full ${verdictTone[lane.verdict].dot}`} />
                    {lane.title}
                    <span className="text-[14px] font-normal tabular-nums text-zinc-600">{items.length}</span>
                  </h2>
                  <p className="mt-1 text-[13px] text-zinc-500">{lane.body}</p>
                </div>
                {lane.verdict === "blocked" && items.length > 0 && (
                  <a href={href.copilot} className="flex shrink-0 items-center gap-1.5 text-[12.5px] text-zinc-400 hover:text-zinc-100">
                    <SparkIcon width={13} height={13} /> Plan a purchase with Copilot
                  </a>
                )}
              </div>
              {items.length ? (
                <div className="scroll-thin -mx-6 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
                  {items.map(({ product }) => (
                    <ProductTile
                      key={product.id}
                      product={product}
                      balance={persona.balance}
                      className="w-[228px] shrink-0 snap-start"
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-[14px] border border-dashed border-zinc-800 px-5 py-8 text-center text-[13px] text-zinc-500">
                  Nothing in this lane for {persona.name}
                  {query || category !== "all" ? " with the current search" : ""}.
                </p>
              )}
            </section>
          );
        })}

        {/* Full catalog */}
        <section id="catalog" className="mt-24 scroll-mt-32 border-t border-zinc-800 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-zinc-50">All products</h2>
              <p className="mt-1 text-[13px] text-zinc-500">
                <span className="tabular-nums text-zinc-300">{grid.length}</span> of {searched.length} · prices include
                shipping from the cheapest in-stock store
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                aria-controls="filters"
                className={`${btn.secondary} h-9 rounded-full px-3.5 text-[12.5px] lg:hidden`}
              >
                <FilterIcon width={14} height={14} />
                Filters{activeFilters ? ` · ${activeFilters}` : ""}
              </button>
              <label className="relative">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-9 appearance-none rounded-full border border-zinc-800 bg-zinc-925 pr-9 pl-4 text-[12.5px] text-zinc-200 focus:border-zinc-600 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
                <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[10px] text-zinc-500">▾</span>
              </label>
            </div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside
              id="filters"
              aria-label="Filters"
              className={`flex flex-col gap-5 lg:sticky lg:top-[128px] lg:flex lg:self-start ${filtersOpen ? "" : "max-lg:hidden"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-zinc-100">Filters</span>
                {activeFilters > 0 && (
                  <button type="button" onClick={clearAll} className="text-[12px] text-zinc-500 hover:text-zinc-100">
                    Clear all
                  </button>
                )}
              </div>
              <FilterGroup title="Guardian verdict">
                {LANES.map((l) => (
                  <Check key={l.verdict} checked={verdicts.has(l.verdict)} onChange={() => setVerdicts((s) => toggle(s, l.verdict))}>
                    <span className="flex items-center gap-2">
                      <span className={`size-1.5 rounded-full ${verdictTone[l.verdict].dot}`} />
                      {l.title}
                    </span>
                    <span className="tabular-nums text-zinc-600">{counts[l.verdict]}</span>
                  </Check>
                ))}
              </FilterGroup>
              <FilterGroup title="Max price">
                <input
                  type="range"
                  min={50}
                  max={MAX_PRICE}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Maximum price"
                  className="w-full accent-zinc-50"
                />
                <div className="flex justify-between text-[11.5px] tabular-nums text-zinc-500">
                  <span>$50</span>
                  <span className="text-zinc-200">{maxPrice >= MAX_PRICE ? "Any price" : `Up to ${usd(maxPrice)}`}</span>
                </div>
                <button
                  type="button"
                  disabled={approvable < 50}
                  onClick={() => setMaxPrice(Math.min(MAX_PRICE, Math.max(50, Math.floor(approvable / 50) * 50)))}
                  className="mt-1 self-start text-left text-[12px] text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-100 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                >
                  {approvable < 50 ? "Nothing approvable today" : `Match what Guardian approves (up to ${usd(approvable)})`}
                </button>
              </FilterGroup>
              <FilterGroup title="Stores">
                {merchants.map((m) => (
                  <Check key={m} checked={stores.has(m)} onChange={() => setStores((s) => toggle(s, m))}>
                    {m}
                  </Check>
                ))}
              </FilterGroup>
            </aside>

            <div>
              {grid.length ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3">
                  {grid.map(({ product }) => (
                    <ProductTile key={product.id} product={product} balance={persona.balance} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center rounded-[18px] border border-dashed border-zinc-800 px-6 py-20 text-center">
                  <SearchIcon width={20} height={20} className="text-zinc-600" />
                  <p className="mt-4 text-[14px] font-medium text-zinc-200">No products match</p>
                  <p className="mt-1 text-[12.5px] text-zinc-500">Loosen a filter or try another search.</p>
                  <button type="button" onClick={clearAll} className={`${btn.secondary} mt-5 h-9 rounded-full px-4 text-[12.5px]`}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
