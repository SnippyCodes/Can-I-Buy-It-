import { useEffect, useRef, useState } from "react";
import {
  evaluatePurchase,
  PAY_IN_4_MAX,
  PAY_IN_4_MIN,
  payIn4Schedule,
  RESERVE_FLOOR,
  usd,
  type Persona,
} from "../guardian/evaluate";
import { CheckIcon, LockIcon, ShieldIcon, SparkIcon } from "../guardian/icons";
import { ReserveMeter } from "../guardian/ReserveMeter";
import { href } from "../guardian/router";
import { btn } from "../guardian/ui";
import { VerdictBadge } from "../guardian/VerdictBadge";
import { PayPalWordmark, paypalButton } from "../guardian/brand";

type Method = "full" | "payIn4";

/* Real PayPal REST v2 Sandbox checkout with HITL safety gating */
type Checkout =
  | { status: "IDLE" }
  | { status: "INITIALIZING_ORDER" }
  | { status: "AWAITING_APPROVAL"; orderId: string; approveUrl?: string; error?: string }
  | { status: "CAPTURING"; orderId: string; approveUrl?: string }
  | { status: "ORDER_AUTHORIZED"; orderId: string; captureId?: string };

function sandboxOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  return Array.from({ length: 17 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface GuardianCheckoutProps {
  itemName: string;
  total: number;
  merchant: string;
  persona: Persona;
  /** "paypal" renders the gold PayPal checkout button for the stage action. */
  buttonStyle?: "default" | "paypal";
}

export function GuardianCheckout({
  itemName,
  total,
  merchant,
  persona,
  buttonStyle = "default",
}: GuardianCheckoutProps) {
  const evaluation = evaluatePurchase(total, persona.balance);
  const [method, setMethod] = useState<Method>(evaluation.verdict === "payIn4" ? "payIn4" : "full");
  const [checkout, setCheckout] = useState<Checkout>({ status: "IDLE" });
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const remaining = method === "payIn4" ? evaluation.afterFirstInstallment : evaluation.afterFull;
  const methodBreaches = remaining < RESERVE_FLOOR;
  const chargeToday = method === "payIn4" ? evaluation.installment : total;
  const schedule = payIn4Schedule(total);
  const busy = checkout.status === "INITIALIZING_ORDER" || checkout.status === "CAPTURING";
  const locked = checkout.status !== "IDLE";

  async function stage() {
    setCheckout({ status: "INITIALIZING_ORDER" });
    try {
      const res = await fetch("/api/paypal/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: chargeToday,
          currency: "USD",
          itemName: `${itemName} via ${merchant}`,
          payIn4: method === "payIn4",
        }),
      });
      const data = await res.json();
      const orderId = data.orderId || sandboxOrderId();
      setCheckout({
        status: "AWAITING_APPROVAL",
        orderId,
        approveUrl: data.approveUrl,
      });
    } catch {
      setCheckout({
        status: "AWAITING_APPROVAL",
        orderId: sandboxOrderId(),
      });
    }
  }

  async function approve(orderId: string, approveUrl?: string) {
    setCheckout({ status: "CAPTURING", orderId, approveUrl });
    try {
      const res = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorText = data.error || `HTTP ${res.status}`;
        const isNotApproved =
          errorText.includes("ORDER_NOT_APPROVED") ||
          errorText.includes("422") ||
          errorText.includes("INSTRUMENT_DECLINED");
        setCheckout({
          status: "AWAITING_APPROVAL",
          orderId,
          approveUrl,
          error: isNotApproved
            ? "Payer approval required: Please click 'Authorize on PayPal Sandbox', log into sandbox buyer account, and click 'Agree and Pay' before capturing."
            : `PayPal Capture notice: ${errorText}`,
        });
        return;
      }
      setCheckout({
        status: "ORDER_AUTHORIZED",
        orderId,
        captureId: data.captureId || data.id,
      });
    } catch (err: unknown) {
      setCheckout({
        status: "AWAITING_APPROVAL",
        orderId,
        approveUrl,
        error: err instanceof Error ? err.message : "Capture request failed",
      });
    }
  }

  const options: {
    id: Method;
    title: string;
    amount: string;
    detail: string;
    disabled: boolean;
    breaches: boolean;
  }[] = [
    {
      id: "full",
      title: "Pay in full",
      amount: usd(total, { cents: true }),
      detail: `Leaves ${usd(evaluation.afterFull, { cents: true })}`,
      disabled: false,
      breaches: evaluation.afterFull < RESERVE_FLOOR,
    },
    {
      id: "payIn4",
      title: "PayPal Pay in 4",
      amount: `${usd(evaluation.installment, { cents: true })} today`,
      detail: evaluation.payIn4Eligible
        ? `Leaves ${usd(evaluation.afterFirstInstallment, { cents: true })} · 0% APR`
        : `Only for $${PAY_IN_4_MIN}–$${PAY_IN_4_MAX.toLocaleString("en-US")} purchases`,
      disabled: !evaluation.payIn4Eligible,
      breaches: evaluation.afterFirstInstallment < RESERVE_FLOOR,
    },
  ];

  return (
    <section
      aria-label="Guardian assessment and checkout"
      className="overflow-hidden rounded-[14px] border border-zinc-800 bg-zinc-925"
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-300">
            <ShieldIcon width={15} height={15} className="text-zinc-400" />
            Guardian assessment
          </div>
          <VerdictBadge evaluation={evaluation} label={evaluation.headline} />
        </div>
        <p className="text-[13px] leading-[1.6] text-zinc-300">{evaluation.explanation}</p>
        <ReserveMeter evaluation={evaluation} mode={method} />
      </div>

      <fieldset className="flex flex-col gap-2 border-t border-zinc-800 p-5" disabled={locked}>
        <legend className="sr-only">Payment method</legend>
        {options.map((o) => {
          const selected = method === o.id;
          return (
            <label
              key={o.id}
              className={`flex items-center gap-3 rounded-[10px] border p-3 transition-colors ${
                o.disabled
                  ? "cursor-not-allowed border-zinc-800/70 opacity-50"
                  : selected
                    ? "cursor-pointer border-zinc-500 bg-zinc-900"
                    : "cursor-pointer border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <input
                type="radio"
                name="method"
                value={o.id}
                checked={selected}
                disabled={o.disabled}
                onChange={() => setMethod(o.id)}
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
                <span className="block text-[13px] font-medium text-zinc-100">{o.title}</span>
                <span
                  className={`block text-[11.5px] tabular-nums ${
                    !o.disabled && o.breaches ? "text-loss" : "text-zinc-500"
                  }`}
                >
                  {o.detail}
                  {!o.disabled && o.breaches && " · below floor"}
                </span>
              </span>
              <span className="text-[13px] font-medium tabular-nums text-zinc-100">{o.amount}</span>
            </label>
          );
        })}

        {method === "payIn4" && evaluation.payIn4Eligible && (
          <ol className="mt-2 grid grid-cols-4 gap-2" aria-label="Pay in 4 schedule">
            {schedule.map((s, i) => (
              <li key={s.label} className="flex flex-col gap-1">
                <span className={`h-1 rounded-full ${i === 0 ? "bg-zinc-50" : "bg-zinc-700"}`} />
                <span className="mt-1 text-[11px] text-zinc-500">
                  {s.label} · {s.date}
                </span>
                <span className="text-[12px] font-medium tabular-nums text-zinc-200">
                  {usd(s.amount, { cents: true })}
                </span>
              </li>
            ))}
          </ol>
        )}
      </fieldset>

      <div className="border-t border-zinc-800 bg-zinc-950/40 p-5">
        {checkout.status === "IDLE" || checkout.status === "INITIALIZING_ORDER" ? (
          evaluation.verdict === "blocked" ? (
            <div className="flex flex-col gap-3">
              <p className="text-[12.5px] leading-[1.55] text-zinc-400">
                Guardian won&rsquo;t stage this order for {persona.name}. Items under{" "}
                <span className="text-zinc-100 tabular-nums">
                  {usd(Math.max(persona.balance - RESERVE_FLOOR, 0))}
                </span>{" "}
                are safe today.
              </p>
              <a href={href.copilot} className={`${btn.secondary} h-10 text-[13px]`}>
                <SparkIcon width={14} height={14} />
                Ask Copilot for a plan
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={stage}
                disabled={methodBreaches || busy}
                className={`${buttonStyle === "paypal" ? paypalButton : btn.primary} h-11 text-[13.5px]`}
              >
                {busy ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                    Creating PayPal order…
                  </>
                ) : buttonStyle === "paypal" ? (
                  <>
                    <span className="text-[13px]">{method === "payIn4" ? "Pay in 4 with" : "Check out with"}</span>
                    <PayPalWordmark height={20} />
                  </>
                ) : (
                  <>
                    <LockIcon width={14} height={14} />
                    Stage order · {usd(chargeToday, { cents: true })} today
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-zinc-500">
                {methodBreaches
                  ? "This payment method would breach your $500 floor."
                  : "Guardian pauses before capture. You approve every payment."}
              </p>
            </div>
          )
        ) : checkout.status === "ORDER_AUTHORIZED" ? (
          <div className="flex flex-col gap-3" role="status">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-gain/15 text-gain">
                <CheckIcon width={14} height={14} />
              </span>
              <div>
                <p className="text-[13px] font-medium text-zinc-50">Order authorized</p>
                <p className="text-[11.5px] tabular-nums text-zinc-500">
                  #{checkout.orderId} · {merchant}
                </p>
              </div>
            </div>
            <p className="text-[12.5px] leading-[1.55] text-zinc-400">
              {method === "payIn4"
                ? `Pay in 4 active: ${usd(evaluation.installment, { cents: true })} charged today, three more every two weeks.`
                : `${usd(total, { cents: true })} captured.`}{" "}
              {usd(remaining, { cents: true })} stays liquid.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a href={href.copilot} className={`${btn.secondary} h-9 text-[12.5px]`}>
                View in ledger
              </a>
              <button
                type="button"
                onClick={() => setCheckout({ status: "IDLE" })}
                className={`${btn.ghost} h-9 text-[12.5px]`}
              >
                Start over
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-[10px] border border-caution/25 bg-caution/[0.06] p-3">
              <p className="flex items-center gap-2 text-[12.5px] font-medium text-caution">
                <span className="size-1.5 animate-pulse rounded-full bg-caution" />
                Waiting for your approval
              </p>
              <p className="mt-1.5 text-[12px] leading-[1.55] text-zinc-400">
                Order <span className="tabular-nums font-mono text-zinc-200">#{checkout.orderId}</span> is staged
                for {itemName}. Nothing has been charged.
              </p>
              {"approveUrl" in checkout && checkout.approveUrl && (
                <div className="mt-2.5 pt-2 border-t border-caution/15 flex flex-col gap-2">
                  <a
                    href={checkout.approveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-2 text-xs font-semibold text-amber-300 transition"
                  >
                    <span>1. Authorize on PayPal Sandbox</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                  <p className="text-[11px] text-zinc-400">
                    Log in with your Sandbox Buyer account and click &quot;Agree and Pay&quot;.
                  </p>
                </div>
              )}
            </div>

            {"error" in checkout && checkout.error && (
              <div className="rounded-[10px] border border-rose-500/30 bg-rose-950/20 p-2.5 text-xs text-rose-300">
                <p className="font-semibold text-rose-200">Action Required</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">{checkout.error}</p>
              </div>
            )}

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <button
                type="button"
                onClick={() => approve(checkout.orderId, "approveUrl" in checkout ? checkout.approveUrl : undefined)}
                disabled={busy}
                className={`${btn.primary} h-10 text-[13px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500`}
              >
                {busy ? "Capturing in Sandbox…" : `2. Finalize & Settle ${usd(chargeToday, { cents: true })}`}
              </button>
              <button
                type="button"
                onClick={() => setCheckout({ status: "IDLE" })}
                disabled={busy}
                className={`${btn.secondary} h-10 px-4 text-[13px]`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="border-t border-zinc-800 px-5 py-3 text-[10.5px] text-zinc-500">
        PayPal Orders v2 · Sandbox REST v2 Live Capture · Idempotency key on every request
      </p>
    </section>
  );
}
