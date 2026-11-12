import { useState } from "react";
import { PartnerMark } from "../../guardian/brand";
import { evaluatePurchase, getPersona, usd } from "../../guardian/evaluate";
import { ArrowLeftIcon, SparkIcon, StarIcon, TruckIcon } from "../../guardian/icons";
import { PersonaMenu } from "../../guardian/PersonaMenu";
import { href } from "../../guardian/router";
import { btn } from "../../guardian/ui";
import { bestOffer, categories, getProduct, offerTotal, products } from "../../storefront/catalog";
import { GuardianCheckout } from "../../storefront/GuardianCheckout";
import { PriceHistoryChart } from "../../storefront/PriceHistoryChart";
import { Header } from "../Header";
import { ProductTile } from "./ProductTile";

/* Detail crops of the single catalog photo, standing in for a multi-image gallery. */
const VIEWS = [
  { label: "Front", position: "50% 50%", scale: 1 },
  { label: "Detail", position: "30% 35%", scale: 1.6 },
  { label: "Close-up", position: "70% 65%", scale: 2.1 },
];

type Tab = "overview" | "specs" | "history";

export function ProductPageV2({
  productId,
  personaId,
  onPersonaChange,
}: {
  productId: string;
  personaId: string;
  onPersonaChange: (id: string) => void;
}) {
  const product = getProduct(productId);
  const persona = getPersona(personaId);
  const [offerDomain, setOfferDomain] = useState(() => (product ? bestOffer(product).domain : ""));
  const [variant, setVariant] = useState(() => product?.variant.options[0] ?? "");
  const [view, setView] = useState(0);
  const [tab, setTab] = useState<Tab>("overview");

  const header = (
    <Header
      active="storefront"
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
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950">
        {header}
        <main className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-32 text-center">
          <p className="text-[15px] font-medium text-zinc-100">This product is no longer listed</p>
          <a href={href.storefront} className={`${btn.secondary} mt-5 h-9 rounded-full px-4 text-[13px]`}>
            Back to storefront
          </a>
        </main>
      </div>
    );
  }

  const offer = product.offers.find((o) => o.domain === offerDomain) ?? bestOffer(product);
  const total = offerTotal(offer);
  const evaluation = evaluatePurchase(total, persona.balance);
  const categoryLabel = categories.find((c) => c.id === product.category)?.label;
  const current = VIEWS[view];

  // Cheaper items Guardian would let this persona buy outright, same category first.
  const alternatives = products
    .filter((p) => p.id !== product.id)
    .map((p) => ({ p, total: offerTotal(bestOffer(p)) }))
    .filter(({ total: t }) => evaluatePurchase(t, persona.balance).verdict === "safe" && t < total)
    .sort((a, b) => Number(b.p.category === product.category) - Number(a.p.category === product.category) || b.total - a.total)
    .slice(0, 4)
    .map(({ p }) => p);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specs" },
    { id: "history", label: "Price history" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {header}
      <main className="mx-auto max-w-[1200px] px-6 pt-6 pb-28">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12.5px] text-zinc-500">
          <a href={href.storefront} className="flex items-center gap-1.5 text-zinc-300 hover:text-zinc-50">
            <ArrowLeftIcon width={14} height={14} />
            Storefront
          </a>
          <span className="text-zinc-700">/</span>
          <span>{categoryLabel}</span>
          <span className="text-zinc-700">/</span>
          <span className="truncate text-zinc-400">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex min-w-0 flex-col gap-10">
            {/* Gallery */}
            <div className="grid gap-3 sm:grid-cols-[72px_minmax(0,1fr)]">
              <div className="flex gap-2 max-sm:order-2 sm:flex-col" role="tablist" aria-label="Product views">
                {VIEWS.map((v, i) => (
                  <button
                    key={v.label}
                    type="button"
                    role="tab"
                    aria-selected={view === i}
                    aria-label={v.label}
                    onClick={() => setView(i)}
                    className={`size-[72px] overflow-hidden rounded-[12px] bg-zinc-900 ring-1 transition ${
                      view === i ? "ring-zinc-50" : "opacity-60 ring-zinc-800 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="size-full object-cover text-transparent"
                      style={{ objectPosition: v.position, transform: `scale(${v.scale})` }}
                    />
                  </button>
                ))}
              </div>
              <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] bg-zinc-900 ring-1 ring-white/[0.06]">
                <img
                  src={product.image}
                  alt={`${product.imageAlt}, ${current.label.toLowerCase()} view`}
                  className="size-full object-cover text-transparent transition-transform duration-500"
                  style={{ objectPosition: current.position, transform: `scale(${current.scale})`, transformOrigin: current.position }}
                />
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-zinc-950/70 px-2.5 py-1 text-[11px] text-zinc-200 backdrop-blur">
                  <PartnerMark partner="channel3" size={13} />
                  {product.offers.length} stores on Channel3
                </span>
              </div>
            </div>

            {/* Tabs */}
            <section>
              <div role="tablist" aria-label="Product information" className="flex gap-6 border-b border-zinc-800">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={tab === t.id}
                    aria-controls={`panel-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={`relative pb-3 text-[13px] ${tab === t.id ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-200"}`}
                  >
                    {t.label}
                    {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-px bg-zinc-50" />}
                  </button>
                ))}
              </div>
              <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="pt-6">
                {tab === "overview" && (
                  <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
                    <p className="text-[15px] leading-[1.7] text-zinc-300">{product.description}</p>
                    <ul className="flex flex-col gap-2.5 text-[12.5px] text-zinc-400">
                      <li className="flex items-center gap-2">
                        <TruckIcon width={14} height={14} /> {offer.delivery} from {offer.merchant}
                      </li>
                      <li className="flex items-center gap-2">
                        <StarIcon width={14} height={14} /> {product.rating.toFixed(1)} from {product.reviews.toLocaleString("en-US")} reviews
                      </li>
                    </ul>
                  </div>
                )}
                {tab === "specs" && (
                  <dl className="grid gap-x-10 sm:grid-cols-2">
                    {product.attributes.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-zinc-800 py-3 text-[13px]">
                        <dt className="text-zinc-500">{k}</dt>
                        <dd className="text-right text-zinc-200">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {tab === "history" && <PriceHistoryChart history={product.priceHistory} current={offer.price} />}
              </div>
            </section>
          </div>

          {/* Buy box */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[84px] lg:self-start">
            <div>
              <p className="text-[12px] text-zinc-500">{product.brand}</p>
              <h1 className="mt-1 text-[28px] leading-[1.1] font-semibold tracking-[-0.03em] text-zinc-50">{product.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-zinc-400">
                <StarIcon width={13} height={13} className="fill-zinc-300 stroke-none" />
                <span className="tabular-nums text-zinc-200">{product.rating.toFixed(1)}</span>
                <span className="tabular-nums">· {product.reviews.toLocaleString("en-US")} reviews</span>
              </p>
              <p className="mt-5 text-[34px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-zinc-50">
                {usd(total, { cents: true })}
              </p>
              {evaluation.payIn4Eligible && (
                <p className="mt-2.5 flex items-center gap-2 text-[12.5px] text-zinc-400">
                  <PartnerMark partner="paypal" size={16} />
                  or 4 interest-free payments of{" "}
                  <span className="tabular-nums text-zinc-100">{usd(evaluation.installment, { cents: true })}</span>
                </p>
              )}
            </div>

            <div>
              <p className="text-[12px] text-zinc-400">
                {product.variant.name} <span className="text-zinc-100">{variant}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.variant.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={variant === opt}
                    onClick={() => setVariant(opt)}
                    className={`h-9 min-w-11 rounded-full border px-3.5 text-[12.5px] ${
                      variant === opt ? "border-zinc-50 bg-zinc-50 text-zinc-950" : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="flex w-full items-center justify-between text-[12px] text-zinc-400">Choose a store</legend>
              <div className="mt-2 flex flex-col gap-1.5">
                {product.offers.map((o) => {
                  const selected = o.domain === offer.domain;
                  const cheapest = o.domain === bestOffer(product).domain;
                  return (
                    <label
                      key={o.domain}
                      className={`flex items-center gap-3 rounded-[12px] border px-3.5 py-2.5 transition-colors ${
                        !o.inStock
                          ? "cursor-not-allowed border-zinc-800/60 opacity-45"
                          : selected
                            ? "cursor-pointer border-zinc-500 bg-zinc-900"
                            : "cursor-pointer border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="offer"
                        checked={selected}
                        disabled={!o.inStock}
                        onChange={() => setOfferDomain(o.domain)}
                        className="sr-only"
                      />
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-200">
                        {o.merchant.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-100">
                          <span className="truncate">{o.merchant}</span>
                          {cheapest && <span className="shrink-0 rounded-full bg-gain/10 px-1.5 text-[10px] text-gain">Lowest</span>}
                        </span>
                        <span className="block text-[11px] text-zinc-500">{o.inStock ? o.delivery : "Out of stock"}</span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[12.5px] font-medium tabular-nums text-zinc-100">
                          {usd(offerTotal(o), { cents: true })}
                        </span>
                        <span className="block text-[10.5px] text-zinc-500">
                          {o.shipping ? `incl. ${usd(o.shipping, { cents: true })} ship` : "Free shipping"}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <GuardianCheckout
              key={`${product.id}-${offer.domain}-${persona.id}`}
              itemName={`${product.title} (${variant})`}
              total={total}
              merchant={offer.merchant}
              persona={persona}
              buttonStyle="paypal"
            />
          </aside>
        </div>

        {alternatives.length > 0 && (
          <section className="mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-zinc-50">
                  {evaluation.verdict === "safe" ? `Also safe for ${persona.name}` : `Safe alternatives for ${persona.name}`}
                </h2>
                <p className="mt-1 text-[13px] text-zinc-500">
                  Cheaper picks Guardian would approve in full today.
                </p>
              </div>
              <a href={href.storefront} className="text-[12.5px] text-zinc-400 hover:text-zinc-100">
                Browse storefront
              </a>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4">
              {alternatives.map((p) => (
                <ProductTile key={p.id} product={p} balance={persona.balance} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
