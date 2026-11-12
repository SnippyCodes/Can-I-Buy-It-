import type { ReactNode } from "react";
import { evaluatePurchase, getPersona, personas, usd } from "../guardian/evaluate";
import {
  ArrowRightIcon,
  BrandMark,
  CheckIcon,
  ClockIcon,
  LayersIcon,
  LockIcon,
  ReceiptIcon,
  ShieldIcon,
  SparkIcon,
  StoreIcon,
} from "../guardian/icons";
import { href } from "../guardian/router";
import { SiteHeader } from "../guardian/SiteHeader";
import { btn, eyebrow } from "../guardian/ui";
import { VerdictBadge } from "../guardian/VerdictBadge";
import { bestOffer, getProduct, offerTotal, products } from "../storefront/catalog";
import { ProductCard } from "../storefront/ProductCard";
import { GuardianConsole } from "./GuardianConsole";

const STACK = ["PayPal REST v2", "Channel3", "AG Grid", "LangGraph", "OpenRouter", "Render"];

const AGENTS = [
  { name: "Router", role: "Classifies the request: purchase, invoice, order lookup or analytics." },
  { name: "Scraper", role: "Pulls live offers from Channel3 and merchant pages." },
  { name: "Memory", role: "Recalls past spend and recurring bills from the vector store." },
  { name: "Trader", role: "Proposes the best offer and a payment path." },
  { name: "Auditor", role: "Checks the proposal with exact decimal math against the $500 floor." },
  { name: "Arbiter", role: "Ratifies the consensus or sends the proposal back for another pass." },
];

const PREVIEW_IDS = ["studio-anc-over-ear", "court-low-leather", "full-frame-mirrorless", "sport-watch-45"];
const SAMPLE_ID = "studio-anc-over-ear";

function SectionHeading({ kicker, title, body }: { kicker: string; title: ReactNode; body?: string }) {
  return (
    <div className="max-w-[640px]">
      <p className={eyebrow}>{kicker}</p>
      <h2 className="mt-3 text-[36px] leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-zinc-50">
        {title}
      </h2>
      {body && <p className="mt-4 text-[15px] leading-[1.65] text-pretty text-zinc-400">{body}</p>}
    </div>
  );
}

function Tile({
  title,
  body,
  icon,
  children,
  className = "",
}: {
  title: string;
  body: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[16px] border border-zinc-800 bg-zinc-925 ${className}`}
    >
      <div className="relative flex min-h-[188px] flex-1 items-center justify-center border-b border-zinc-800 bg-zinc-950/50 p-6">
        {children}
      </div>
      <div className="p-6">
        <h3 className="flex items-center gap-2 text-[14px] font-medium text-zinc-50">
          <span className="text-zinc-400">{icon}</span>
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.6] text-zinc-400">{body}</p>
      </div>
    </article>
  );
}

/* 90-day balance path that dips toward, but never through, the floor. */
function FloorChart() {
  const pts = [1850, 1720, 1610, 1540, 1180, 1090, 980, 720, 640, 610, 820, 990, 1120, 1040, 930, 1260, 1410, 1380];
  const W = 560;
  const H = 150;
  const max = 2000;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  const y = (v: number) => H - (v / max) * H;
  const d = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H + 8}`} className="h-auto w-full max-w-[560px]" aria-hidden="true">
      <defs>
        <linearGradient id="fc" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fafafa" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fafafa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y={y(500)} width={W} height={H - y(500)} fill="#e5636a" fillOpacity="0.06" />
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#fc)" />
      <path d={d} fill="none" stroke="#e4e4e7" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="0" x2={W} y1={y(500)} y2={y(500)} stroke="#e5636a" strokeOpacity="0.7" strokeDasharray="4 4" />
      <text x={W - 4} y={y(500) - 6} textAnchor="end" fill="#e5636a" fontSize="11">
        $500 floor
      </text>
      <circle cx={x(9)} cy={y(610)} r="4" fill="#09090b" stroke="#fafafa" strokeWidth="1.5" />
      <text x={x(9)} y={y(610) - 12} textAnchor="middle" fill="#a1a1aa" fontSize="11">
        Tightest day · $110 headroom
      </text>
    </svg>
  );
}

function Receipt({
  title,
  tone,
  rows,
  result,
  resultNote,
}: {
  title: string;
  tone: "loss" | "gain";
  rows: [string, string, string?][];
  result: string;
  resultNote: string;
}) {
  const toneText = tone === "loss" ? "text-loss" : "text-gain";
  return (
    <div className="flex flex-col rounded-[14px] border border-zinc-800 bg-zinc-925">
      <p className="border-b border-zinc-800 px-5 py-3 text-[12px] font-medium text-zinc-300">{title}</p>
      <dl className="flex flex-col gap-2.5 px-5 py-4 text-[12.5px]">
        {rows.map(([k, v, note]) => (
          <div key={k} className="flex items-baseline justify-between gap-4">
            <dt className="text-zinc-500">{k}</dt>
            <dd className="text-right tabular-nums text-zinc-200">
              {v}
              {note && <span className="block text-[11px] text-zinc-500">{note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-baseline justify-between border-t border-dashed border-zinc-800 px-5 py-4">
        <span className={`text-[12px] ${toneText}`}>{resultNote}</span>
        <span className={`text-[20px] font-semibold tabular-nums tracking-[-0.02em] ${toneText}`}>{result}</span>
      </div>
    </div>
  );
}

export function LandingPage({
  personaId,
  onPersonaChange,
}: {
  personaId: string;
  onPersonaChange: (id: string) => void;
}) {
  const persona = getPersona(personaId);
  const sample = getProduct(SAMPLE_ID)!;
  const samplePrice = offerTotal(bestOffer(sample));
  const preview = PREVIEW_IDS.map((id) => products.find((p) => p.id === id)!);

  return (
    <div className="min-h-screen overflow-x-clip bg-zinc-950">
      <SiteHeader
        active="home"
        right={
          <>
            <a href={href.storefront} className={`${btn.ghost} h-9 px-3 text-[13px] max-sm:hidden`}>
              Storefront
            </a>
            <a href={href.copilot} className={`${btn.primary} h-9 px-3.5 text-[13px]`}>
              Launch Copilot
            </a>
          </>
        }
      />

      {/* Hero */}
      <section className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] bg-[size:56px_56px]"
        />
        <div
          aria-hidden="true"
          className="absolute top-[-280px] left-1/2 -z-10 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(250,250,250,0.08),transparent)]"
        />

        <div className="mx-auto grid max-w-[1280px] gap-14 px-6 pt-20 pb-24 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:pt-28">
          <div>
            <a
              href={href.copilot}
              className="inline-flex h-7 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-925/80 pr-3 pl-1 text-[12px] text-zinc-300 hover:border-zinc-700"
            >
              <span className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10.5px] font-semibold text-zinc-950">New</span>
              Guardian Copilot for PayPal
              <ArrowRightIcon width={12} height={12} className="text-zinc-500" />
            </a>
            <h1 className="mt-7 text-[clamp(44px,6vw,76px)] leading-[0.98] font-semibold tracking-[-0.045em] text-zinc-50">
              Simulate, shop
              <br />
              and transact
              <br />
              <span className="text-zinc-500">before you spend.</span>
            </h1>
            <p className="mt-7 max-w-[520px] text-[16px] leading-[1.65] text-pretty text-zinc-400">
              An agentic checkout that knows rent is due Friday. Guardian checks every purchase against
              your upcoming bills and a protected <span className="text-zinc-100">$500 reserve floor</span>, then
              routes to PayPal Pay in 4 or stops the order entirely.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={href.storefront} className={`${btn.primary} h-11 px-5 text-[14px]`}>
                Browse the storefront
                <ArrowRightIcon width={15} height={15} />
              </a>
              <a href={href.copilot} className={`${btn.secondary} h-11 px-5 text-[14px]`}>
                <SparkIcon width={15} height={15} />
                Talk to Guardian
              </a>
            </div>
            <dl className="mt-14 grid max-w-[560px] grid-cols-2 gap-x-8 gap-y-6 border-t border-zinc-800 pt-8 sm:grid-cols-4">
              {[
                ["100M+", "products indexed"],
                ["25,000+", "stores searched"],
                ["$500", "floor, always kept"],
                ["0", "silent charges"],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="mt-0.5 text-[12px] text-zinc-500">{label}</dt>
                  <dd className="text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-zinc-50">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <GuardianConsole personaId={personaId} onPersonaChange={onPersonaChange} />
        </div>
      </section>

      {/* Built on */}
      <section className="border-y border-zinc-800/80 bg-zinc-925/40">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-10 gap-y-4 px-6 py-7">
          <p className="text-[12px] text-zinc-500">Built on</p>
          {STACK.map((name) => (
            <span key={name} className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-400">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto grid max-w-[1280px] gap-12 px-6 py-28 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <SectionHeading
          kicker="The overdraft hazard"
          title={
            <>
              Checkout bots see the cart.
              <span className="text-zinc-500"> They miss the rent.</span>
            </>
          }
          body="Shopping agents check whether today's balance covers one purchase, then pay. They don't know about payroll, tuition or the bill landing in three days. Guardian models the whole month before it agrees."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Receipt
            title="Standard checkout bot"
            tone="loss"
            rows={[
              ["Balance", "$600.00"],
              ["Cart", "−$350.00"],
              ["Check", "Balance ≥ cart", "Approved"],
              ["Rent due in 3 days", "Not checked"],
            ]}
            result="$250.00"
            resultNote="Below floor"
          />
          <Receipt
            title="Guardian Copilot"
            tone="gain"
            rows={[
              ["Balance", "$600.00"],
              ["Cart", "$350.00"],
              ["Floor check", "Full payment fails", "$250 < $500"],
              ["Route", "Pay in 4", "$87.50 today, 0% APR"],
            ]}
            result="$512.50"
            resultNote="Floor intact"
          />
        </div>
      </section>

      {/* Swarm */}
      <section className="border-t border-zinc-800/80">
        <div className="mx-auto max-w-[1280px] px-6 py-28">
          <SectionHeading
            kicker="How it decides"
            title="Six agents debate every checkout."
            body="A stateful LangGraph swarm, not a single prompt. If the Auditor's numbers don't hold, the Arbiter sends the proposal back to the Trader. Nothing reaches PayPal until they agree and you approve."
          />
          <ol className="relative mt-14 grid gap-px overflow-hidden rounded-[16px] border border-zinc-800 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-7">
            {AGENTS.map((a, i) => (
              <li key={a.name} className="flex flex-col bg-zinc-925 p-5">
                <span className="text-[11px] tabular-nums text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-6 text-[14px] font-medium text-zinc-50">{a.name}</span>
                <span className="mt-1.5 text-[12.5px] leading-[1.55] text-zinc-400">{a.role}</span>
              </li>
            ))}
            <li className="flex flex-col bg-zinc-50 p-5 text-zinc-950">
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <LockIcon width={12} height={12} />
                Gate
              </span>
              <span className="mt-6 text-[14px] font-semibold">You</span>
              <span className="mt-1.5 text-[12.5px] leading-[1.55] text-zinc-600">
                Guardian halts before capture. Approve, edit or cancel.
              </span>
            </li>
          </ol>
          <p className="mt-4 flex items-center gap-2 text-[12px] text-zinc-500">
            <span className="h-px w-6 border-t border-dashed border-zinc-600" />
            Arbiter → Trader correction loop runs until the Auditor&rsquo;s math holds
          </p>
        </div>
      </section>

      {/* Bento */}
      <section className="border-t border-zinc-800/80">
        <div className="mx-auto max-w-[1280px] px-6 py-28">
          <SectionHeading kicker="What you get" title="One agent for shopping, paying and forecasting cash." />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <Tile
              className="md:col-span-2"
              icon={<ShieldIcon width={15} height={15} />}
              title="A $500 floor that holds"
              body="Rolling 90-day cash flow against scheduled obligations. Discretionary spend that would cross the floor is refused, every time."
            >
              <FloorChart />
            </Tile>
            <Tile
              icon={<ClockIcon width={15} height={15} />}
              title="Pay in 4, routed for you"
              body="When a lump sum is risky, Guardian checks whether four bi-weekly installments keep you safe."
            >
              <div className="grid w-full max-w-[260px] grid-cols-4 gap-2" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span
                      className={`grid size-10 place-items-center rounded-full border text-[10.5px] tabular-nums ${
                        i === 0 ? "border-zinc-50 bg-zinc-50 font-semibold text-zinc-950" : "border-zinc-700 text-zinc-400"
                      }`}
                    >
                      {i === 0 ? "Now" : `W${i * 2}`}
                    </span>
                    <span className="text-[11px] tabular-nums text-zinc-400">$87.50</span>
                  </div>
                ))}
              </div>
            </Tile>
            <Tile
              icon={<LockIcon width={15} height={15} />}
              title="Nothing moves without you"
              body="Orders are staged in a pre-execution gate. Capture only runs after you approve."
            >
              <div aria-hidden="true" className="w-full max-w-[260px] rounded-[12px] border border-zinc-800 bg-zinc-925 p-4">
                <p className="flex items-center gap-2 text-[11.5px] text-caution">
                  <span className="size-1.5 rounded-full bg-caution" />
                  Awaiting approval
                </p>
                <p className="mt-2 text-[13px] font-medium text-zinc-100">Studio ANC Headphones</p>
                <p className="text-[11.5px] tabular-nums text-zinc-500">Order #8XK2N4R7 · $87.50 today</p>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <span className="grid h-8 place-items-center rounded-[8px] bg-zinc-50 text-[12px] font-medium text-zinc-950">
                    Approve
                  </span>
                  <span className="grid h-8 place-items-center rounded-[8px] border border-zinc-800 px-3 text-[12px] text-zinc-300">
                    Cancel
                  </span>
                </div>
              </div>
            </Tile>
            <Tile
              icon={<StoreIcon width={15} height={15} />}
              title="25,000+ stores in one search"
              body="Text or image search through Channel3. Compare landed cost across merchants in one place."
            >
              <ul
                aria-hidden="true"
                className="w-full max-w-[260px] divide-y divide-zinc-800 rounded-[12px] border border-zinc-800 bg-zinc-925 text-[12px]"
              >
                {(
                  [
                    ["Atlas Marketplace", "$353.99", false],
                    ["Northline", "$350.00", true],
                    ["Sonic Supply", "$364.00", false],
                  ] as const
                ).map(([m, p, best]) => (
                  <li key={m} className="flex items-center justify-between px-3.5 py-2.5">
                    <span className={best ? "text-zinc-50" : "text-zinc-400"}>{m}</span>
                    <span className={`flex items-center gap-1.5 tabular-nums ${best ? "text-zinc-50" : "text-zinc-500"}`}>
                      {best && <CheckIcon width={12} height={12} className="text-gain" />}
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </Tile>
            <Tile
              icon={<ReceiptIcon width={15} height={15} />}
              title="A ledger you can interrogate"
              body="Live PayPal reporting and a 90-day forecast in AG Grid, plus invoices staged through the Invoicing API."
            >
              <table aria-hidden="true" className="w-full max-w-[280px] text-[11px] tabular-nums">
                <thead>
                  <tr className="text-left text-zinc-500">
                    <th className="pb-2 font-normal">Date</th>
                    <th className="pb-2 font-normal">Payee</th>
                    <th className="pb-2 text-right font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {[
                    ["Jun 03", "Rent", "−$1,240", "text-zinc-300"],
                    ["Jun 05", "Payroll", "+$2,860", "text-gain"],
                    ["Jun 07", "Utilities", "−$118", "text-zinc-300"],
                    ["Jun 09", "Pay in 4 · 2/4", "−$87.50", "text-zinc-300"],
                  ].map(([d, p, a, c]) => (
                    <tr key={p} className="border-t border-zinc-800">
                      <td className="py-2 text-zinc-500">{d}</td>
                      <td className="py-2">{p}</td>
                      <td className={`py-2 text-right ${c}`}>{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tile>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="border-t border-zinc-800/80">
        <div className="mx-auto max-w-[1280px] px-6 py-28">
          <SectionHeading
            kicker="Sandbox personas"
            title={
              <>
                Same headphones.
                <span className="text-zinc-500"> Four different answers.</span>
              </>
            }
            body={`Guardian's verdict on the ${usd(samplePrice)} ${sample.title.toLowerCase()} for each PayPal Sandbox persona. Pick one to shop as them.`}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {personas.map((p) => {
              const e = evaluatePurchase(samplePrice, p.balance);
              const active = p.id === personaId;
              return (
                <a
                  key={p.id}
                  href={href.product(SAMPLE_ID)}
                  onClick={() => onPersonaChange(p.id)}
                  className={`group flex flex-col rounded-[16px] border p-5 transition-colors ${
                    active ? "border-zinc-600 bg-zinc-900" : "border-zinc-800 bg-zinc-925 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-full bg-zinc-800 text-[12px] font-medium text-zinc-200">
                      {p.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                    {active && <span className="text-[11px] text-zinc-400">Selected</span>}
                  </div>
                  <p className="mt-5 text-[14px] font-medium text-zinc-50">{p.name}</p>
                  <p className="text-[12px] text-zinc-500">{p.label}</p>
                  <p className="mt-4 text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-zinc-50">
                    {usd(p.balance)}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
                    <VerdictBadge evaluation={e} />
                    <ArrowRightIcon
                      width={14}
                      height={14}
                      className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Storefront preview */}
      <section className="border-t border-zinc-800/80">
        <div className="mx-auto max-w-[1280px] px-6 py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              kicker="Storefront"
              title="A store that checks your balance before you click Buy."
              body={`Showing verdicts for ${persona.name} at ${usd(persona.balance)}.`}
            />
            <a href={href.storefront} className={`${btn.secondary} h-10 px-4 text-[13px]`}>
              Browse all products
              <ArrowRightIcon width={14} height={14} />
            </a>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {preview.map((p) => (
              <ProductCard key={p.id} product={p} balance={persona.balance} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/80">
        <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden px-6 py-32 text-center">
          <div
            aria-hidden="true"
            className="absolute bottom-[-320px] left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(250,250,250,0.07),transparent)]"
          />
          <LayersIcon width={22} height={22} className="mx-auto text-zinc-500" />
          <h2 className="mx-auto mt-6 max-w-[16ch] text-[clamp(36px,5vw,60px)] leading-[1.02] font-semibold tracking-[-0.04em] text-zinc-50">
            Ask before you buy.
          </h2>
          <p className="mx-auto mt-5 max-w-[460px] text-[15px] leading-[1.65] text-zinc-400">
            Log in with PayPal Sandbox, pick a persona and let Guardian stress-test your next purchase.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={href.copilot} className={`${btn.primary} h-11 px-5 text-[14px]`}>
              <SparkIcon width={15} height={15} />
              Launch Guardian Copilot
            </a>
            <a href={href.storefront} className={`${btn.secondary} h-11 px-5 text-[14px]`}>
              Open storefront
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/80">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 pt-8 pb-24 text-[12px] text-zinc-500">
          <span className="flex items-center gap-2.5">
            <BrandMark size={20} />
            <span className="text-zinc-300">Can I Buy It?</span>
            <span>Submitted to the PayPal AI Hackathon</span>
          </span>
          <span>PayPal Sandbox only. No real funds move.</span>
        </div>
      </footer>
    </div>
  );
}
