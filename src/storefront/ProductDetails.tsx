import { useState } from "react";
import { getPersona, usd } from "../guardian/evaluate";
import { ArrowLeftIcon, SparkIcon, StarIcon, TruckIcon } from "../guardian/icons";
import { PersonaMenu } from "../guardian/PersonaMenu";
import { href } from "../guardian/router";
import { SiteHeader } from "../guardian/SiteHeader";
import { btn, eyebrow } from "../guardian/ui";
import { bestOffer, categories, getProduct, offerTotal, products } from "./catalog";
import { GuardianCheckout } from "./GuardianCheckout";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { ProductCard } from "./ProductCard";

export function ProductDetails({
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

  const header = (
    <SiteHeader
      active="storefront"
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
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950">
        {header}
        <main className="mx-auto flex max-w-[1280px] flex-col items-center px-6 py-32 text-center">
          <p className="text-[15px] font-medium text-zinc-100">This product is no longer listed</p>
          <a href={href.storefront} className={`${btn.secondary} mt-5 h-9 px-4 text-[13px]`}>
            Back to storefront
          </a>
        </main>
      </div>
    );
  }

  const offer = product.offers.find((o) => o.domain === offerDomain) ?? bestOffer(product);
  const total = offerTotal(offer);
  const categoryLabel = categories.find((c) => c.id === product.category)?.label;
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...products.filter((p) => p.category !== product.category),
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-950">
      {header}
      <main className="mx-auto max-w-[1280px] px-6 pt-6 pb-24">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12.5px] text-zinc-500">
          <a href={href.storefront} className="flex items-center gap-1.5 text-zinc-300 hover:text-zinc-50">
            <ArrowLeftIcon width={14} height={14} />
            Storefront
          </a>
          <span>/</span>
          <span>{categoryLabel}</span>
          <span>/</span>
          <span className="truncate text-zinc-300">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="flex flex-col gap-10">
            <div className="overflow-hidden rounded-[16px] border border-zinc-800 bg-zinc-900">
              <img src={product.image} alt={product.imageAlt} className="aspect-[5/4] w-full object-cover text-transparent" />
            </div>

            <section className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className={eyebrow}>About</h2>
                <p className="mt-3 text-[14px] leading-[1.65] text-zinc-300">{product.description}</p>
              </div>
              <dl className="divide-y divide-zinc-800 border-y border-zinc-800">
                {product.attributes.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5 text-[12.5px]">
                    <dt className="text-zinc-500">{k}</dt>
                    <dd className="text-right text-zinc-200">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-[14px] border border-zinc-800 bg-zinc-925 p-5">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-[13px] font-medium text-zinc-100">Price history</h2>
                <span className="text-[11.5px] text-zinc-500">Lowest across stores · 90 days</span>
              </div>
              <PriceHistoryChart history={product.priceHistory} current={offer.price} />
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <p className="text-[12px] text-zinc-500">{product.brand}</p>
              <h1 className="mt-1 text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] text-zinc-50">
                {product.title}
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-[12px] text-zinc-400">
                <StarIcon width={13} height={13} className="fill-zinc-300 stroke-none" />
                <span className="tabular-nums text-zinc-200">{product.rating.toFixed(1)}</span>
                <span className="tabular-nums">({product.reviews.toLocaleString("en-US")} reviews)</span>
              </div>
              <p className="mt-5 text-[32px] font-semibold tabular-nums tracking-[-0.02em] text-zinc-50">
                {usd(total, { cents: true })}
              </p>
              <p className="text-[12px] text-zinc-500">
                {offer.shipping ? `Includes ${usd(offer.shipping, { cents: true })} shipping` : "Free shipping"} ·{" "}
                {offer.merchant}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-zinc-400">
                {product.variant.name}: <span className="text-zinc-100">{variant}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.variant.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={variant === opt}
                    onClick={() => setVariant(opt)}
                    className={`h-8 min-w-10 rounded-[8px] border px-3 text-[12.5px] ${
                      variant === opt
                        ? "border-zinc-50 text-zinc-50"
                        : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="text-[12px] text-zinc-400">
                {product.offers.length} stores on Channel3
              </legend>
              <div className="mt-2 divide-y divide-zinc-800 overflow-hidden rounded-[12px] border border-zinc-800">
                {product.offers.map((o) => {
                  const selected = o.domain === offer.domain;
                  return (
                    <label
                      key={o.domain}
                      className={`flex items-center gap-3 px-3.5 py-3 ${
                        o.inStock ? "cursor-pointer hover:bg-zinc-925" : "cursor-not-allowed opacity-45"
                      } ${selected ? "bg-zinc-925" : ""}`}
                    >
                      <input
                        type="radio"
                        name="offer"
                        checked={selected}
                        disabled={!o.inStock}
                        onChange={() => setOfferDomain(o.domain)}
                        className="sr-only"
                      />
                      <span
                        className={`grid size-4 shrink-0 place-items-center rounded-full border ${
                          selected ? "border-zinc-50" : "border-zinc-600"
                        }`}
                      >
                        {selected && <span className="size-2 rounded-full bg-zinc-50" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-medium text-zinc-100">{o.merchant}</span>
                        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                          <TruckIcon width={12} height={12} />
                          {o.inStock ? o.delivery : "Out of stock"}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[12.5px] font-medium tabular-nums text-zinc-100">
                          {usd(offerTotal(o), { cents: true })}
                        </span>
                        <span className="block text-[10.5px] text-zinc-500">
                          {o.shipping ? `+${usd(o.shipping, { cents: true })} ship` : "Free ship"}
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
            />
          </aside>
        </div>

        <section className="mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-zinc-50">More like this</h2>
            <a href={href.storefront} className="text-[12.5px] text-zinc-400 hover:text-zinc-100">
              View all
            </a>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} balance={persona.balance} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
