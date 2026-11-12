import type { ReactNode } from "react";
import { GuardianMark, PartnerLockup, PartnerMark, type Partner } from "../../guardian/brand";
import { evaluatePurchase, getPersona, usd, verdictTone } from "../../guardian/evaluate";
import { ArrowRightIcon, CheckIcon, GitHubIcon, SparkIcon } from "../../guardian/icons";
import { href } from "../../guardian/router";
import { btn } from "../../guardian/ui";
import { bestOffer, getProduct, offerTotal } from "../../storefront/catalog";
import { Header } from "../Header";
import { CheckoutTheatre } from "./CheckoutTheatre";
import { DecisionMatrix } from "./DecisionMatrix";

const PARTNERS: Partner[] = ["paypal", "channel3", "aggrid", "render"];

const PAYPAL_APIS: { name: string; endpoint: string; body: string }[] = [
  {
    name: "Orders v2",
    endpoint: "POST /v2/checkout/orders",
    body: "Creates an order with CAPTURE intent and a UUIDv4 PayPal-Request-Id, so retries never double-charge.",
  },
  {
    name: "Pay Later · Pay in 4",
    endpoint: "4 × bi-weekly · 0% APR",
    body: "Routes risky lump sums to four installments when the first one keeps the $500 floor intact.",
  },
  {
    name: "Invoicing v2",
    endpoint: "POST /v2/invoicing/invoices/{id}/send",
    body: "Drafts, numbers and sends invoices for freelancers and merchants receiving payments.",
  },
  {
    name: "Reporting",
    endpoint: "GET /v1/reporting/transactions",
    body: "Pulls 30 days of live transactions and merges write-through captures to skip the 3-hour index lag.",
  },
  {
    name: "Log in with PayPal",
    endpoint: "GET /signin/authorize",
    body: "OAuth 2.0 authorization-code flow creates a multi-tenant account from PayPal identity.",
  },
];

const STACK = ["Next.js 15", "FastAPI", "LangGraph", "OpenRouter · Gemini 2.5 Flash", "ChromaDB", "DeepEval"];

function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-medium text-zinc-500">{children}</p>;
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-3 text-[clamp(30px,3.6vw,44px)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-zinc-50">
      {children}
    </h2>
  );
}

function SurfaceCard({
  partner,
  guardian,
  label,
  title,
  body,
  to,
  cta,
  children,
}: {
  partner?: Partner;
  guardian?: boolean;
  label: string;
  title: string;
  body: string;
  to: string;
  cta: string;
  children: ReactNode;
}) {
  return (
    <a
      href={to}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-zinc-800 bg-zinc-925 transition-colors hover:border-zinc-700"
    >
      <div className="relative h-[220px] overflow-hidden border-b border-zinc-800 bg-[radial-gradient(120%_90%_at_50%_0%,#18181b,#09090b)] p-5">
        {children}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-[11.5px] text-zinc-500">
          {guardian ? <GuardianMark size={16} /> : partner && <PartnerMark partner={partner} size={16} />}
          {label}
        </p>
        <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.015em] text-zinc-50">{title}</h3>
        <p className="mt-2 text-[13px] leading-[1.6] text-zinc-400">{body}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-[13px] text-zinc-300 group-hover:text-zinc-50">
          {cta}
          <ArrowRightIcon width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export function LandingV2({
  personaId,
  onPersonaChange,
}: {
  personaId: string;
  onPersonaChange: (id: string) => void;
}) {
  const persona = getPersona(personaId);
  const miniIds = ["court-low-leather", "studio-anc-over-ear", "full-frame-mirrorless"];

  return (
    <div className="min-h-screen overflow-x-clip bg-zinc-950">
      <Header
        active="home"
        right={
          <>
            <a href={href.storefront} className={`${btn.ghost} h-9 rounded-full px-3.5 text-[13px] max-sm:hidden`}>
              Storefront
            </a>
            <a href={href.copilot} className={`${btn.primary} h-9 rounded-full px-4 text-[13px]`}>
              Launch Copilot
            </a>
          </>
        }
      />

      {/* Hero */}
      <section className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)] bg-[size:72px_72px]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-[420px] left-1/2 -z-10 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(94,189,138,0.10),rgba(250,250,250,0.06),rgba(120,113,255,0.10),rgba(94,189,138,0.10))] blur-[90px]"
        />

        <div className="mx-auto max-w-[1200px] px-6 pt-20 text-center sm:pt-28">
          <a
            href={href.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] pr-3.5 pl-1.5 text-[12px] text-zinc-300 backdrop-blur hover:border-white/20"
          >
            <PartnerMark partner="paypal" size={20} />
            PayPal AI Hackathon · Agentic commerce
            <ArrowRightIcon width={12} height={12} className="text-zinc-500" />
          </a>

          <h1 className="mx-auto mt-8 max-w-[19ch] bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-500 bg-clip-text text-balance text-[clamp(42px,6.2vw,78px)] leading-[0.95] font-semibold tracking-[-0.05em] text-transparent">
            Simulate, shop and transact before you spend.
          </h1>
          <p className="mx-auto mt-7 max-w-[600px] text-[clamp(15px,1.4vw,17px)] leading-[1.65] text-pretty text-zinc-400">
            Guardian Copilot is an autonomous financial agent for PayPal. It protects a{" "}
            <span className="text-gain">$500 safety floor</span>, finds live multi-merchant deals on Channel3,
            and lets you interrogate cash flow in AG Grid.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={href.storefront} className={`${btn.primary} h-12 w-full rounded-full px-6 text-[14px] sm:w-auto`}>
              Go to Storefront
              <ArrowRightIcon width={15} height={15} />
            </a>
            <a href={href.copilot} className={`${btn.secondary} h-12 w-full rounded-full px-6 text-[14px] sm:w-auto`}>
              <SparkIcon width={15} height={15} />
              Go to Chat Copilot
              <span className="rounded-[5px] border border-white/10 bg-white/[0.06] px-1.5 py-px text-[10px] font-semibold tracking-[0.04em] text-zinc-300">
                AI AGENT
              </span>
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-zinc-500">
            {["Protected $500 safety floor", "25,000+ Channel3 retailers", "PayPal REST v2 Sandbox ready"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckIcon width={13} height={13} className="text-gain" />
                {t}
              </li>
            ))}
          </ul>

          <ul
            aria-label="Built with"
            className="mx-auto mt-14 grid max-w-[760px] grid-cols-2 justify-items-center gap-y-7 sm:grid-cols-4"
          >
            {PARTNERS.map((p) => (
              <li key={p} className="opacity-85 transition-opacity hover:opacity-100">
                <PartnerLockup partner={p} size={30} textClass="text-[18px]" />
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-20 max-w-[1200px] px-6 pb-28">
          <CheckoutTheatre />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.06]">
        <dl className="mx-auto grid max-w-[1200px] grid-cols-2 divide-white/[0.06] px-6 md:grid-cols-4 md:divide-x">
          {[
            ["100M+", "products searchable by text or image"],
            ["25,000+", "retailers compared on landed cost"],
            ["6", "agents debate every checkout"],
            ["0", "payments captured without your approval"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col-reverse justify-end gap-1.5 px-2 py-9 md:px-8 md:first:pl-0">
              <dt className="max-w-[200px] text-[12.5px] leading-[1.5] text-zinc-500">{l}</dt>
              <dd className="text-[34px] font-semibold tabular-nums tracking-[-0.04em] text-zinc-50">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Surfaces */}
      <section className="mx-auto max-w-[1200px] px-6 py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <Kicker>One guardian, three surfaces</Kicker>
            <H2>Shop, ask and audit from the same safety model.</H2>
          </div>
          <p className="max-w-[340px] text-[14px] leading-[1.6] text-zinc-400">
            Every surface reads the same balance and the same $500 floor, so an answer in chat matches the
            badge in the store.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <SurfaceCard
            partner="channel3"
            label="Storefront · Channel3"
            title="A store that checks before Buy"
            body="Search 100M+ items. Every card carries Guardian's verdict for the active PayPal persona."
            to={href.storefront}
            cta="Open storefront"
          >
            <div className="grid grid-cols-3 gap-2.5" aria-hidden="true">
              {miniIds.map((id) => {
                const p = getProduct(id)!;
                const e = evaluatePurchase(offerTotal(bestOffer(p)), persona.balance);
                return (
                  <div key={id} className="overflow-hidden rounded-[10px] border border-zinc-800 bg-zinc-925">
                    <img src={p.image} alt="" className="aspect-[4/5] w-full object-cover text-transparent" />
                    <div className="flex items-center gap-1.5 p-2">
                      <span className={`size-1.5 rounded-full ${verdictTone[e.verdict].dot}`} />
                      <span className="text-[10.5px] tabular-nums text-zinc-300">{usd(offerTotal(bestOffer(p)))}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SurfaceCard>

          <SurfaceCard
            guardian
            label="Copilot · LangGraph swarm"
            title="Ask anything about your money"
            body="Stress-test 90-day cash flow, review wires and stage invoices in plain language."
            to={href.copilot}
            cta="Open Copilot"
          >
            <div className="flex h-full flex-col justify-end gap-2.5" aria-hidden="true">
              <p className="ml-auto max-w-[85%] rounded-[12px] border border-zinc-800 bg-zinc-900 px-3 py-2 text-[11.5px] text-zinc-200">
                Can I buy the $350 headphones?
              </p>
              <div className="max-w-[92%] rounded-[12px] border border-zinc-800 bg-zinc-925 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10.5px] text-zinc-500">
                  <GuardianMark size={12} /> Guardian
                </p>
                <p className="mt-1 text-[11.5px] leading-[1.5] text-zinc-300">
                  Not in full. Pay in 4 keeps <span className="text-gain">$512.50</span> liquid, above your floor.
                </p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard
            partner="aggrid"
            label="Ledger · AG Grid"
            title="A ledger you can interrogate"
            body="Live PayPal reporting, commitments and a 90-day forecast in sortable, filterable grids."
            to={href.copilot}
            cta="Open ledger canvas"
          >
            <div className="overflow-hidden rounded-[10px] border border-zinc-800 bg-zinc-925 text-[10.5px] tabular-nums" aria-hidden="true">
              <div className="grid grid-cols-[52px_1fr_64px] border-b border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-500">
                <span>Date</span>
                <span>Payee</span>
                <span className="text-right">Amount</span>
              </div>
              {[
                ["Jun 03", "Rent", "−$1,240", "text-zinc-300"],
                ["Jun 05", "Payroll", "+$2,860", "text-gain"],
                ["Jun 07", "Utilities", "−$118", "text-zinc-300"],
                ["Jun 09", "Pay in 4 · 2/4", "−$87.50", "text-zinc-300"],
                ["Jun 12", "Invoice #0042", "+$640", "text-gain"],
              ].map(([d, p, a, c], i) => (
                <div
                  key={p}
                  className={`grid grid-cols-[52px_1fr_64px] px-3 py-[7px] ${i % 2 ? "bg-white/[0.015]" : ""} ${i === 3 ? "ring-1 ring-inset ring-zinc-600" : ""}`}
                >
                  <span className="text-zinc-500">{d}</span>
                  <span className="text-zinc-300">{p}</span>
                  <span className={`text-right ${c}`}>{a}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </section>

      {/* Decision matrix */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <div className="max-w-[680px]">
            <Kicker>Sandbox personas</Kicker>
            <H2>
              Same catalog. <span className="text-zinc-500">Different answers for different wallets.</span>
            </H2>
            <p className="mt-4 text-[15px] leading-[1.65] text-zinc-400">
              Ten bulk-provisioned PayPal Sandbox personas ship with the repo. Pick a cell to see how Guardian
              reasons, then shop as that persona.
            </p>
          </div>
          <div className="mt-12">
            <DecisionMatrix personaId={personaId} onPersonaChange={onPersonaChange} />
          </div>
        </div>
      </section>

      {/* PayPal integration */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-6 py-28 lg:grid-cols-[400px_minmax(0,1fr)]">
          <div>
            <PartnerMark partner="paypal" size={44} />
            <Kicker>
              <span className="mt-6 block">Built on PayPal REST v2</span>
            </Kicker>
            <H2>Five PayPal APIs. One guardian in front of them.</H2>
            <p className="mt-4 text-[15px] leading-[1.65] text-zinc-400">
              Guardian never charges a card on its own. Orders stop at a pre-execution gate until you approve
              them in the sandbox.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {STACK.map((s) => (
                <span key={s} className="rounded-full border border-zinc-800 px-3 py-1 text-[12px] text-zinc-400">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <ol className="divide-y divide-zinc-800 border-y border-zinc-800">
            {PAYPAL_APIS.map((api, i) => (
              <li key={api.name} className="grid gap-2 py-6 sm:grid-cols-[40px_200px_minmax(0,1fr)] sm:gap-6">
                <span className="text-[12px] tabular-nums text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[14px] font-medium text-zinc-50">{api.name}</p>
                  <p className="mt-1 font-mono text-[11px] break-all text-zinc-500">{api.endpoint}</p>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-zinc-400">{api.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden border-t border-white/[0.06]">
        <div
          aria-hidden="true"
          className="absolute -bottom-[380px] left-1/2 -z-10 h-[640px] w-[1000px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(94,189,138,0.10),rgba(120,113,255,0.10),rgba(94,189,138,0.10))] blur-[90px]"
        />
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-32 text-center">
          <GuardianMark size={64} className="shadow-[0_20px_60px_-10px_rgba(94,189,138,0.35)]" />
          <h2 className="mt-8 max-w-[20ch] text-balance text-[clamp(38px,5.5vw,68px)] leading-[0.98] font-semibold tracking-[-0.045em] text-zinc-50">
            Ask before you buy.
          </h2>
          <p className="mt-5 max-w-[460px] text-[15px] leading-[1.65] text-zinc-400">
            Pick a sandbox persona, find something you want and let Guardian decide how you can afford it.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={href.storefront} className={`${btn.primary} h-12 rounded-full px-6 text-[14px]`}>
              Go to Storefront
              <ArrowRightIcon width={15} height={15} />
            </a>
            <a href={href.repo} target="_blank" rel="noreferrer" className={`${btn.secondary} h-12 rounded-full px-6 text-[14px]`}>
              <GitHubIcon width={15} height={15} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6 pt-10 pb-24">
          <div className="flex items-center gap-3">
            <GuardianMark size={24} />
            <div className="leading-tight">
              <p className="text-[13px] font-medium text-zinc-200">Can I Buy It?</p>
              <p className="text-[11.5px] text-zinc-500">MIT licensed · PayPal Sandbox only, no real funds move</p>
            </div>
          </div>
          <ul className="flex items-center gap-5" aria-label="Partners">
            {PARTNERS.map((p) => (
              <li key={p} className="opacity-60 transition-opacity hover:opacity-100">
                <PartnerLockup partner={p} size={18} textClass="text-[12.5px]" />
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
