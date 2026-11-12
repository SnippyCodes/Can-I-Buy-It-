import { PartnerMark } from "../../guardian/brand";
import { evaluatePurchase, RESERVE_FLOOR, usd, type Evaluation } from "../../guardian/evaluate";
import { StarIcon } from "../../guardian/icons";
import { href } from "../../guardian/router";
import { VerdictBadge } from "../../guardian/VerdictBadge";
import { bestOffer, offerTotal, type Product } from "../../storefront/catalog";

/** Smallest top-up that would unlock a blocked item, via full payment or Pay in 4. */
export function shortfall(e: Evaluation) {
  const full = e.price + RESERVE_FLOOR - e.balance;
  const split = e.payIn4Eligible ? e.installment + RESERVE_FLOOR - e.balance : Infinity;
  return Math.max(Math.ceil(Math.min(full, split)), 0);
}

export function VerdictLine({ evaluation }: { evaluation: Evaluation }) {
  if (evaluation.verdict === "safe")
    return (
      <span className="text-zinc-500">
        Leaves <span className="tabular-nums text-zinc-300">{usd(evaluation.afterFull - RESERVE_FLOOR)}</span> above floor
      </span>
    );
  if (evaluation.verdict === "payIn4")
    return (
      <span className="flex items-center gap-1.5 text-zinc-500">
        <PartnerMark partner="paypal" size={13} />
        <span>
          4 × <span className="tabular-nums text-zinc-300">{usd(evaluation.installment, { cents: true })}</span> with Pay in 4
        </span>
      </span>
    );
  return (
    <span className="text-zinc-500">
      Needs <span className="tabular-nums text-loss">{usd(shortfall(evaluation))}</span> more to stay safe
    </span>
  );
}

export function ProductTile({
  product,
  balance,
  className = "",
}: {
  product: Product;
  balance: number;
  className?: string;
}) {
  const offer = bestOffer(product);
  const total = offerTotal(offer);
  const evaluation = evaluatePurchase(total, balance);
  const start = product.priceHistory[0];
  const drop = Math.round(((start - offer.price) / start) * 100);

  return (
    <a href={href.product(product.id)} className={`group flex flex-col ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-zinc-900 ring-1 ring-white/[0.06] ring-inset">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover text-transparent transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-1.5">
          <span className="rounded-full bg-zinc-950/70 backdrop-blur-md">
            <VerdictBadge evaluation={evaluation} />
          </span>
          {drop >= 12 && (
            <span className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10.5px] font-semibold whitespace-nowrap tabular-nums text-zinc-950">
              −{drop}%
            </span>
          )}
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px] text-zinc-200">
          <span className="flex items-center gap-1.5">
            <PartnerMark partner="channel3" size={14} />
            {product.offers.length} stores
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <StarIcon width={11} height={11} className="fill-zinc-200 stroke-none" />
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-0.5 pt-3.5">
        <p className="text-[11.5px] text-zinc-500">{product.brand}</p>
        <h3 className="mt-0.5 line-clamp-1 text-[14px] font-medium text-zinc-100 group-hover:text-zinc-50">
          {product.title}
        </h3>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="text-[16px] font-semibold tabular-nums tracking-[-0.015em] text-zinc-50">
            {usd(total, { cents: true })}
          </span>
          {drop >= 12 && (
            <span className="text-[11.5px] tabular-nums text-zinc-600 line-through">{usd(start)}</span>
          )}
        </div>
        <p className="mt-1.5 text-[11.5px]">
          <VerdictLine evaluation={evaluation} />
        </p>
      </div>
    </a>
  );
}
