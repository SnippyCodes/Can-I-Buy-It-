import { useState } from "react";
import { evaluatePurchase, getPersona, payIn4Schedule, personas, RESERVE_FLOOR, usd } from "../guardian/evaluate";
import { ArrowRightIcon, ShieldIcon } from "../guardian/icons";
import { ReserveMeter } from "../guardian/ReserveMeter";
import { href } from "../guardian/router";
import { VerdictBadge } from "../guardian/VerdictBadge";

const PRESETS = [
  { label: "Sneakers", price: 115 },
  { label: "Headphones", price: 350 },
  { label: "Camera", price: 1899 },
];

/* Interactive hero demo: same evaluatePurchase() the storefront uses. */
export function GuardianConsole({
  personaId,
  onPersonaChange,
}: {
  personaId: string;
  onPersonaChange: (id: string) => void;
}) {
  const [price, setPrice] = useState(350);
  const persona = getPersona(personaId);
  const evaluation = evaluatePurchase(price, persona.balance);
  const schedule = payIn4Schedule(price);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-px -z-10 rounded-[18px] bg-gradient-to-b from-zinc-700/60 via-zinc-800/40 to-transparent"
      />
      <div className="overflow-hidden rounded-[18px] bg-zinc-925 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3.5">
          <span className="flex items-center gap-2 text-[12px] font-medium text-zinc-300">
            <ShieldIcon width={14} height={14} className="text-zinc-400" />
            Can I buy it?
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span className="size-1.5 rounded-full bg-gain" />
            Live check
          </span>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="console-price" className="text-[11.5px] text-zinc-500">
                Item price
              </label>
              <div className="flex gap-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPrice(p.price)}
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      price === p.price ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[34px] font-semibold text-zinc-600">$</span>
              <input
                id="console-price"
                type="number"
                min={1}
                max={5000}
                value={price}
                onChange={(e) => setPrice(Math.max(1, Math.min(5000, Number(e.target.value) || 1)))}
                className="w-full bg-transparent text-[40px] leading-none font-semibold tracking-[-0.03em] text-zinc-50 tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <input
              type="range"
              aria-label="Item price slider"
              min={10}
              max={2500}
              step={5}
              value={Math.min(price, 2500)}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-3 w-full accent-zinc-50"
            />
          </div>

          <div>
            <p className="text-[11.5px] text-zinc-500">Paying as</p>
            <div className="mt-2 grid grid-cols-4 gap-1 rounded-[10px] border border-zinc-800 bg-zinc-950 p-1">
              {personas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={p.id === personaId}
                  onClick={() => onPersonaChange(p.id)}
                  className={`rounded-[7px] px-1 py-1.5 text-center transition-colors ${
                    p.id === personaId ? "bg-zinc-800 text-zinc-50" : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  <span className="block truncate text-[11px] font-medium">{p.name.split(" ")[0]}</span>
                  <span className="block text-[10.5px] tabular-nums opacity-80">{usd(p.balance)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-50">{evaluation.headline}</p>
              <VerdictBadge evaluation={evaluation} />
            </div>
            <p className="mt-1.5 min-h-[40px] text-[12.5px] leading-[1.55] text-zinc-400">{evaluation.explanation}</p>
            <div className="mt-4">
              <ReserveMeter evaluation={evaluation} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-800 pt-3 text-[11px]">
              <div>
                <dt className="text-zinc-500">Pay in full</dt>
                <dd className={`mt-0.5 tabular-nums ${evaluation.afterFull < RESERVE_FLOOR ? "text-loss" : "text-zinc-100"}`}>
                  {usd(evaluation.afterFull, { cents: true })} left
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Pay in 4 today</dt>
                <dd className="mt-0.5 tabular-nums text-zinc-100">
                  {evaluation.payIn4Eligible ? usd(schedule[0].amount, { cents: true }) : "Not eligible"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Floor</dt>
                <dd className="mt-0.5 tabular-nums text-zinc-100">$500.00</dd>
              </div>
            </dl>
          </div>

          <a
            href={href.storefront}
            className="group flex items-center justify-between text-[12.5px] text-zinc-400 hover:text-zinc-100"
          >
            Shop with {persona.name}&rsquo;s balance
            <ArrowRightIcon width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
