import { evaluatePurchase, usd } from "../guardian/evaluate";
import { StarIcon } from "../guardian/icons";
import { href } from "../guardian/router";
import { VerdictBadge } from "../guardian/VerdictBadge";
import { bestOffer, offerTotal, type Product } from "./catalog";

export function ProductCard({ product, balance }: { product: Product; balance: number }) {
  const offer = bestOffer(product);
  const total = offerTotal(offer);
  const evaluation = evaluatePurchase(total, balance);
  const start = product.priceHistory[0];
  const drop = Math.round(((start - offer.price) / start) * 100);

  return (
    <a
      href={href.product(product.id)}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-zinc-800 bg-zinc-925 transition-colors hover:border-zinc-700"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="size-full object-cover text-transparent transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-1.5 p-3">
          <VerdictBadge evaluation={evaluation} />
          {drop >= 12 && (
            <span className="rounded-full bg-zinc-950/80 px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap tabular-nums text-zinc-200 backdrop-blur">
              −{drop}% · 90d
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[11px] text-zinc-500">{product.brand}</p>
          <h3 className="mt-0.5 line-clamp-2 text-[13.5px] leading-[1.35] font-medium text-zinc-100">
            {product.title}
          </h3>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[16px] font-semibold tabular-nums tracking-[-0.01em] text-zinc-50">
              {usd(total, { cents: true })}
            </p>
            <p className="truncate text-[11px] text-zinc-500">
              {offer.merchant} · {product.offers.length} stores
            </p>
          </div>
          <span className="flex items-center gap-1 text-[11px] tabular-nums text-zinc-400">
            <StarIcon width={12} height={12} className="fill-zinc-400 stroke-none" />
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </a>
  );
}
