import { useState } from "react";
import { evaluatePurchase, getPersona, personas, usd, verdictTone, type Verdict } from "../../guardian/evaluate";
import { ArrowRightIcon } from "../../guardian/icons";
import { ReserveMeter } from "../../guardian/ReserveMeter";
import { href } from "../../guardian/router";
import { VerdictBadge } from "../../guardian/VerdictBadge";
import { bestOffer, getProduct, offerTotal } from "../../storefront/catalog";

const PRODUCT_IDS = [
  "everyday-trainer",
  "court-low-leather",
  "studio-anc-over-ear",
  "rangefinder-compact",
  "full-frame-mirrorless",
];

const CELL_LABEL: Record<Verdict, string> = { safe: "Buy", payIn4: "Pay in 4", blocked: "Wait" };

export function DecisionMatrix({
  personaId,
  onPersonaChange,
}: {
  personaId: string;
  onPersonaChange: (id: string) => void;
}) {
  const items = PRODUCT_IDS.map((id) => {
    const p = getProduct(id)!;
    return { product: p, price: offerTotal(bestOffer(p)) };
  });
  const [productId, setProductId] = useState("studio-anc-over-ear");
  const selected = items.find((i) => i.product.id === productId) ?? items[2];
  const persona = getPersona(personaId);
  const evaluation = evaluatePurchase(selected.price, persona.balance);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="scroll-thin overflow-x-auto rounded-[18px] border border-zinc-800 bg-zinc-925">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-left">
          <caption className="sr-only">Guardian verdict per persona and product</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[168px] border-b border-zinc-800 p-4 text-[11px] font-medium text-zinc-500">
                Persona · balance
              </th>
              {items.map(({ product, price }) => (
                <th key={product.id} scope="col" className="border-b border-l border-zinc-800 p-3 align-bottom font-normal">
                  <button
                    type="button"
                    onClick={() => setProductId(product.id)}
                    aria-pressed={product.id === productId}
                    className={`group flex w-full flex-col items-start gap-2 rounded-[10px] p-1.5 text-left ${
                      product.id === productId ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="aspect-square w-full rounded-[8px] bg-zinc-900 object-cover text-transparent"
                    />
                    <span className="line-clamp-1 text-[11.5px] text-zinc-300">{product.title}</span>
                    <span className="text-[13px] font-semibold tabular-nums text-zinc-50">{usd(price)}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {personas.map((p) => (
              <tr key={p.id} className={p.id === personaId ? "bg-white/[0.025]" : ""}>
                <th scope="row" className="border-t border-zinc-800 p-4 font-normal">
                  <button type="button" onClick={() => onPersonaChange(p.id)} className="text-left">
                    <span className={`block text-[12.5px] font-medium ${p.id === personaId ? "text-zinc-50" : "text-zinc-300"}`}>
                      {p.name}
                    </span>
                    <span className="block text-[11.5px] tabular-nums text-zinc-500">{usd(p.balance)}</span>
                  </button>
                </th>
                {items.map(({ product, price }) => {
                  const e = evaluatePurchase(price, p.balance);
                  const tone = verdictTone[e.verdict];
                  const active = p.id === personaId && product.id === productId;
                  return (
                    <td key={product.id} className="border-t border-l border-zinc-800 p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onPersonaChange(p.id);
                          setProductId(product.id);
                        }}
                        aria-label={`${p.name}, ${product.title}: ${e.headline}`}
                        aria-pressed={active}
                        className={`flex h-11 w-full items-center justify-center gap-1.5 rounded-[8px] text-[12px] font-medium transition-colors ${
                          active ? `ring-1 ring-inset ${tone.chip} ring-current` : `${tone.text} hover:bg-white/[0.04]`
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${tone.dot}`} />
                        {CELL_LABEL[e.verdict]}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="flex flex-col rounded-[18px] border border-zinc-800 bg-zinc-925 p-6" aria-live="polite">
        <p className="text-[11.5px] text-zinc-500">
          {persona.name} · {usd(persona.balance)}
        </p>
        <p className="mt-1 text-[15px] font-medium text-zinc-100">{selected.product.title}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[22px] font-semibold tracking-[-0.02em] text-zinc-50">{evaluation.headline}</p>
        </div>
        <div className="mt-2">
          <VerdictBadge evaluation={evaluation} />
        </div>
        <p className="mt-4 text-[13px] leading-[1.6] text-zinc-400">{evaluation.explanation}</p>
        <div className="mt-6">
          <ReserveMeter evaluation={evaluation} />
        </div>
        <a
          href={href.product(selected.product.id)}
          className="group mt-auto flex items-center justify-between border-t border-zinc-800 pt-5 text-[13px] text-zinc-300 hover:text-zinc-50 max-lg:mt-6"
        >
          Open in storefront as {persona.name.split(" ")[0]}
          <ArrowRightIcon width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </aside>
    </div>
  );
}
