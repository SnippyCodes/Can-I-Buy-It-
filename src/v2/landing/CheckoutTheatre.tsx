"use client";

import { useEffect, useState } from "react";
import { PartnerMark } from "../../guardian/brand";
import { payIn4Schedule } from "../../guardian/evaluate";
import { ArrowRightIcon, CheckIcon, PauseIcon, PlayIcon, ReplayIcon } from "../../guardian/icons";
import { href } from "../../guardian/router";
import { getProduct } from "../../storefront/catalog";

type Tone = "neutral" | "loss" | "caution" | "gain";

/* The README's worked example: $350 headphones on a $600 PayPal balance. */
const STEPS: { agent: string; text: string; tone: Tone }[] = [
  { agent: "Router", text: "Intent PURCHASE_CHECKOUT · Studio ANC headphones", tone: "neutral" },
  { agent: "Scraper", text: "3 offers on Channel3 · best $350.00 at Northline", tone: "neutral" },
  { agent: "Memory", text: "Rent $1,240 due in 3 days · payroll lands on the 28th", tone: "neutral" },
  { agent: "Trader", text: "Proposes paying $350.00 in full", tone: "neutral" },
  { agent: "Auditor", text: "$600.00 − $350.00 = $250.00 · breaches $500 floor", tone: "loss" },
  { agent: "Arbiter", text: "Rejected · reroute to PayPal Pay in 4", tone: "caution" },
  { agent: "Auditor", text: "$600.00 − $87.50 = $512.50 · floor intact", tone: "gain" },
  { agent: "Gate", text: "Consensus ratified · halted for your approval", tone: "gain" },
];

const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-zinc-500",
  loss: "bg-loss",
  caution: "bg-caution",
  gain: "bg-gain",
};
const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-zinc-300",
  loss: "text-loss",
  caution: "text-caution",
  gain: "text-gain",
};

const STEP_MS = 1000;
const HOLD_MS = 4200;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function CheckoutTheatre() {
  const product = getProduct("studio-anc-over-ear")!;
  const schedule = payIn4Schedule(350);
  const [step, setStep] = useState(() => (prefersReducedMotion() ? STEPS.length : 0));
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const done = step >= STEPS.length;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setStep((s) => (s >= STEPS.length ? 0 : s + 1)), done ? HOLD_MS : STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, step, done]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-x-10 -top-10 -bottom-20 -z-10 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(250,250,250,0.07),transparent)]"
      />
      <div className="rounded-[22px] bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-px shadow-[0_50px_140px_-40px_rgba(0,0,0,0.95)]">
        <div className="overflow-hidden rounded-[21px] bg-zinc-925">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
            </div>
            <p className="text-[11.5px] text-zinc-500">
              Live checkout trace · <span className="text-zinc-300">PayPal Sandbox</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause trace" : "Play trace"}
                className="grid size-7 place-items-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                {playing ? <PauseIcon width={13} height={13} /> : <PlayIcon width={13} height={13} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setPlaying(true);
                }}
                aria-label="Replay trace"
                className="grid size-7 place-items-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <ReplayIcon width={13} height={13} />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)_300px]">
            {/* Cart */}
            <section aria-label="Cart" className="flex flex-col gap-4 border-zinc-800 p-5 max-lg:border-b lg:border-r">
              <p className="flex items-center justify-between text-[11px] font-medium tracking-[0.06em] text-zinc-500 uppercase">
                Cart
                <span className="flex items-center gap-1.5 tracking-normal normal-case">
                  <PartnerMark partner="channel3" size={14} />
                  Channel3
                </span>
              </p>
              <div className="overflow-hidden rounded-[12px] bg-zinc-900">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="aspect-[4/3] w-full object-cover text-transparent"
                />
              </div>
              <div>
                <p className="text-[13px] font-medium text-zinc-100">{product.title}</p>
                <p className="text-[11.5px] text-zinc-500">Northline Electronics · free shipping</p>
              </div>
              <div className="mt-auto flex items-center justify-between rounded-[10px] border border-zinc-800 bg-zinc-950/60 px-3 py-2.5">
                <span className="flex items-center gap-2 text-[11.5px] text-zinc-400">
                  <PartnerMark partner="paypal" size={16} />
                  Balance
                </span>
                <span className="text-[13px] font-medium tabular-nums text-zinc-100">$600.00</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11.5px] text-zinc-500">Total</span>
                <span className="text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-zinc-50">$350.00</span>
              </div>
            </section>

            {/* Swarm log */}
            <section aria-label="Guardian agent trace" className="flex flex-col border-zinc-800 p-5 max-lg:border-b lg:border-r">
              <p className="flex items-center justify-between text-[11px] font-medium tracking-[0.06em] text-zinc-500 uppercase">
                Guardian swarm
                <span className="tracking-normal tabular-nums normal-case">
                  {Math.min(step, STEPS.length)}/{STEPS.length}
                </span>
              </p>
              <ol className="mt-4 flex flex-col gap-1" aria-live="polite">
                {STEPS.map((s, i) => {
                  const shown = i < step;
                  const current = i === step - 1 && !done;
                  return (
                    <li
                      key={i}
                      className={`grid grid-cols-[14px_72px_minmax(0,1fr)] items-baseline gap-2 rounded-[8px] px-2 py-[7px] transition-all duration-500 ${
                        shown ? "opacity-100" : "translate-y-1 opacity-0"
                      } ${current ? "bg-white/[0.04]" : ""}`}
                      aria-hidden={!shown}
                    >
                      <span className={`size-1.5 translate-y-[-1px] rounded-full ${TONE_DOT[s.tone]}`} />
                      <span className="font-mono text-[11.5px] text-zinc-500">{s.agent}</span>
                      <span className={`text-[12.5px] leading-[1.45] ${s.tone === "neutral" ? "text-zinc-300" : TONE_TEXT[s.tone]}`}>
                        {s.text}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-auto pt-4">
                <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-300 transition-[width] duration-700 ease-out"
                    style={{ width: `${(Math.min(step, STEPS.length) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </section>

            {/* PayPal sheet */}
            <section aria-label="PayPal approval" className="relative flex flex-col p-5">
              <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] text-zinc-500 uppercase">
                <PartnerMark partner="paypal" size={16} />
                Approval
              </p>

              <div className={`mt-4 flex flex-1 flex-col transition-all duration-500 ${done ? "opacity-100" : "opacity-30 blur-[1.5px]"}`}>
                <p className="text-[12px] text-zinc-400">PayPal Pay in 4 · 0% APR</p>
                <p className="mt-1 text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-zinc-50">
                  $87.50
                  <span className="ml-1.5 text-[13px] font-normal tracking-normal text-zinc-500">today</span>
                </p>
                <ol className="mt-5 flex flex-col gap-2.5">
                  {schedule.map((s, i) => (
                    <li key={s.label} className="flex items-center gap-3 text-[12px]">
                      <span
                        className={`grid size-5 place-items-center rounded-full border ${
                          i === 0 ? "border-zinc-50 bg-zinc-50 text-zinc-950" : "border-zinc-700 text-zinc-500"
                        }`}
                      >
                        {i === 0 ? <CheckIcon width={10} height={10} strokeWidth={2.2} /> : <span className="text-[9px]">{i + 1}</span>}
                      </span>
                      <span className="flex-1 text-zinc-400">
                        {s.label} <span className="text-zinc-600">· {s.date}</span>
                      </span>
                      <span className="tabular-nums text-zinc-200">${s.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex items-center justify-between rounded-[10px] border border-gain/20 bg-gain/[0.07] px-3 py-2.5 text-[12px]">
                  <span className="text-gain">Stays liquid</span>
                  <span className="font-medium tabular-nums text-gain">$512.50</span>
                </div>
                <a
                  href={href.product("studio-anc-over-ear")}
                  tabIndex={done ? 0 : -1}
                  className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-[9px] bg-[#ffc439] text-[13px] font-semibold text-[#003087] hover:brightness-95"
                >
                  Try this checkout
                  <ArrowRightIcon width={14} height={14} />
                </a>
              </div>
              {!done && (
                <p className="pointer-events-none absolute inset-x-5 top-1/2 text-center text-[12px] text-zinc-400">
                  Waiting for consensus…
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
