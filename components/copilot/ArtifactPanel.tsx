"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ACTUAL_THROUGH_DAY,
  BUFFER_M,
  cashSeries,
  corridors,
  reserveTranches,
  settlementWeeks,
} from "./data";
import { CloseIcon, DownloadIcon } from "./icons";

export type ArtifactView = "charts" | "table";

interface TableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const usd = (value: number) =>
  `${value < 0 ? "−" : "+"}$${Math.abs(value).toLocaleString("en-US")}`;

const reserveTotal = reserveTranches.reduce((sum, t) => sum + t.amount, 0);
const netSettled = settlementWeeks.reduce((sum, w) => sum + w.inflow - w.outflow, 0);
const corridorNet = corridors.reduce((sum, c) => sum + c.net, 0);

const tables: Record<"cash" | "settlements" | "reserves" | "corridors", TableSpec> = {
  cash: {
    title: "Cash balance",
    headers: ["Horizon", "Balance", "Above buffer"],
    rows: cashSeries
      .filter((p) => p.day % 30 === 0)
      .map((p) => [
        p.day === 0 ? "Today" : `Day ${p.day}`,
        `$${p.value.toFixed(2)}M`,
        `+$${(p.value - BUFFER_M).toFixed(2)}M`,
      ]),
  },
  settlements: {
    title: "Net settlements",
    headers: ["Week", "Inflow", "Outflow", "Net"],
    rows: settlementWeeks.map((w) => [
      w.week,
      `$${w.inflow}K`,
      `$${w.outflow}K`,
      `+$${w.inflow - w.outflow}K`,
    ]),
  },
  reserves: {
    title: "Reserve allocation",
    headers: ["Tranche", "Balance", "APY", "Liquidity"],
    rows: reserveTranches.map((t) => [
      t.name,
      `$${t.amount.toLocaleString("en-US")}K`,
      t.apy,
      t.liquidity,
    ]),
  },
  corridors: {
    title: "Settlement corridors",
    headers: ["Corridor", "Net", "Coverage", "Status"],
    rows: corridors.map((c) => [c.corridor, usd(c.net), c.coverage, c.status]),
  },
};

function toCsv(specs: TableSpec[]) {
  const cell = (v: string) => `"${v.replace(/−/g, "-").replace(/"/g, '""')}"`;
  return specs
    .map((t) =>
      [
        cell(t.title),
        t.headers.map(cell).join(","),
        ...t.rows.map((r) => r.map(cell).join(",")),
      ].join("\n"),
    )
    .join("\n\n");
}

function cellTone(value: string, header: string) {
  if (header === "Status") {
    if (value === "Verified") return "text-gain";
    if (value === "Review") return "text-caution";
    return "text-zinc-300";
  }
  if (value.startsWith("+")) return "text-gain";
  if (value.startsWith("−")) return "text-loss";
  return "text-zinc-300";
}

function DataTable({ spec }: { spec: TableSpec }) {
  return (
    <table className="w-full border-collapse text-[12px] tabular-nums">
      <thead>
        <tr>
          {spec.headers.map((h, i) => (
            <th
              key={h}
              className={`border-b border-zinc-800 pb-2 text-[11px] font-medium text-zinc-500 ${i === 0 ? "text-left" : "text-right"}`}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {spec.rows.map((row) => (
          <tr key={row[0]} className="border-b border-zinc-900 last:border-0">
            {row.map((value, i) => (
              <td
                key={i}
                className={`py-2.5 ${i === 0 ? "text-left text-zinc-200" : `text-right ${cellTone(value, spec.headers[i])}`}`}
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BentoCell({
  label,
  value,
  caption,
  captionTone = "muted",
  children,
}: {
  label: string;
  value: string;
  caption: string;
  captionTone?: "muted" | "gain" | "caution";
  children: ReactNode;
}) {
  const tone = { muted: "text-zinc-500", gain: "text-gain", caution: "text-caution" }[captionTone];
  return (
    <article className="flex min-h-0 flex-col rounded-[12px] border border-zinc-800 bg-zinc-950 p-4">
      <header className="mb-4">
        <h3 className="text-[11px] font-medium text-zinc-400">{label}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[20px] font-semibold tracking-[-0.02em] tabular-nums text-zinc-50">
            {value}
          </span>
          <span className={`text-[11px] tabular-nums ${tone}`}>{caption}</span>
        </div>
      </header>
      <div className="scroll-thin flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </article>
  );
}

function CashChart() {
  const maxValue = 4;
  const x = (day: number) => (day / 90) * 100;
  const y = (value: number) => 100 - (value / maxValue) * 100;
  const toPoints = (points: typeof cashSeries) =>
    points.map((p) => `${x(p.day)},${y(p.value)}`).join(" ");
  const split = cashSeries.findIndex((p) => p.day === ACTUAL_THROUGH_DAY);
  const area = `M0,100 L${toPoints(cashSeries).replace(/ /g, " L")} L100,100 Z`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 gap-2">
        <div className="-my-1.5 flex w-[30px] shrink-0 flex-col justify-between text-right text-[10px] tabular-nums text-zinc-600">
          {["$4M", "$3M", "$2M", "$1M", "$0"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className="relative min-h-0 flex-1">
          <svg
            className="absolute inset-0 size-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            role="img"
            aria-label="Cash balance rises from $1.85M today to a projected $3.45M at day 90"
          >
            {[1, 2, 3].map((v) => (
              <line
                key={v}
                x1="0"
                x2="100"
                y1={y(v)}
                y2={y(v)}
                stroke="#18181b"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              x1="0"
              x2="100"
              y1="100"
              y2="100"
              stroke="#27272a"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="0"
              x2="100"
              y1={y(BUFFER_M)}
              y2={y(BUFFER_M)}
              stroke="#71717a"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            <path d={area} fill="#fafafa" fillOpacity="0.04" />
            <polyline
              points={toPoints(cashSeries.slice(0, split + 1))}
              fill="none"
              stroke="#fafafa"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={toPoints(cashSeries.slice(split))}
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span
            className="absolute right-0 text-[10px] text-zinc-500"
            style={{ top: `calc(${y(BUFFER_M)}% - 16px)` }}
          >
            Covenant buffer $0.50M
          </span>
        </div>
      </div>
      <div className="ml-[38px] mt-2 flex justify-between text-[10px] text-zinc-600">
        <span>Today</span>
        <span>30d</span>
        <span>60d</span>
        <span>90d</span>
      </div>
      <div className="mt-3 flex gap-4 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <i className="h-px w-3 bg-zinc-50" />
          Actual
        </span>
        <span className="flex items-center gap-1.5">
          <i className="w-3 border-t border-dashed border-zinc-400" />
          Projected
        </span>
      </div>
    </div>
  );
}

function SettlementChart() {
  const max = 500;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="flex min-h-0 flex-1 items-end gap-4 border-b border-zinc-800 px-1"
        role="img"
        aria-label="Weekly inflow and outflow for the last four weeks"
      >
        {settlementWeeks.map((w) => (
          <div key={w.week} className="flex h-full flex-1 items-end justify-center gap-1">
            <div
              className="w-4 rounded-t-[3px] bg-zinc-200"
              style={{ height: `${(w.inflow / max) * 100}%` }}
            />
            <div
              className="w-4 rounded-t-[3px] bg-zinc-600"
              style={{ height: `${(w.outflow / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 px-1 pt-2">
        {settlementWeeks.map((w) => (
          <div key={w.week} className="flex-1 text-center">
            <p className="text-[10px] text-zinc-600">{w.week}</p>
            <p className="text-[11px] tabular-nums text-zinc-300">+${w.inflow - w.outflow}K</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-[2px] bg-zinc-200" />
          Inflow
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-[2px] bg-zinc-600" />
          Outflow
        </span>
      </div>
    </div>
  );
}

function ReserveChart() {
  const shades = ["bg-zinc-100", "bg-zinc-400", "bg-zinc-600", "bg-zinc-700"];
  return (
    <div>
      <div
        className="flex h-2 gap-px overflow-hidden rounded-full"
        role="img"
        aria-label="Reserve allocation by tranche"
      >
        {reserveTranches.map((t, i) => (
          <div
            key={t.name}
            className={shades[i]}
            style={{ width: `${(t.amount / reserveTotal) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-4">
        {reserveTranches.map((t, i) => (
          <li
            key={t.name}
            className="flex items-center gap-2.5 border-b border-zinc-900 py-2.5 text-[12px] tabular-nums last:border-0"
          >
            <i className={`size-2 shrink-0 rounded-[2px] ${shades[i]}`} />
            <span className="flex-1 text-zinc-300">{t.name}</span>
            <span className="text-zinc-500">{((t.amount / reserveTotal) * 100).toFixed(1)}%</span>
            <span className="w-16 text-right text-zinc-100">${(t.amount / 1000).toFixed(2)}M</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ArtifactPanelProps {
  view: ArtifactView;
  onViewChange: (view: ArtifactView) => void;
  onClose: () => void;
}

export function ArtifactPanel({ view, onViewChange, onClose }: ArtifactPanelProps) {
  const [exported, setExported] = useState(false);

  useEffect(() => {
    if (!exported) return;
    const timer = window.setTimeout(() => setExported(false), 2000);
    return () => window.clearTimeout(timer);
  }, [exported]);

  function exportCsv() {
    const blob = new Blob([toCsv(Object.values(tables))], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "guardian-q3-liquidity-canvas.csv";
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
  }

  const charts = view === "charts";

  return (
    <section
      aria-label="Canvas"
      className="flex h-full w-[540px] shrink-0 flex-col border-l border-zinc-800 bg-zinc-925 transition-all duration-300"
    >
      <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4">
        <div className="min-w-0">
          <h2 className="truncate text-[13px] font-semibold text-zinc-50">
            Q3 Liquidity &amp; Risk Canvas
          </h2>
          <p className="text-[11px] text-zinc-500">PayPal Sandbox · Real-Time Reserve Telemetry</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div
            role="tablist"
            aria-label="Canvas view"
            className="flex rounded-[7px] border border-zinc-800 bg-zinc-900 p-0.5"
          >
            {(["charts", "table"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={view === option}
                onClick={() => onViewChange(option)}
                className={`h-6 rounded-[5px] px-2.5 text-[11px] font-medium transition cursor-pointer ${
                  view === option ? "bg-zinc-700 text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {option === "charts" ? "Charts" : "Table"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="flex h-7 items-center gap-1.5 rounded-[7px] border border-zinc-800 px-2.5 text-[11px] font-medium text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 transition cursor-pointer"
          >
            <DownloadIcon width={13} height={13} />
            {exported ? "Exported" : "Export CSV"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 items-center gap-1 rounded-[7px] px-2 text-[11px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50 transition cursor-pointer"
          >
            <CloseIcon width={13} height={13} />
            Close
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 p-3 overflow-hidden">
        <BentoCell
          label="Cash balance · 90 days"
          value="$3.45M"
          caption="+18.4% QoQ"
          captionTone="gain"
        >
          {charts ? <CashChart /> : <DataTable spec={tables.cash} />}
        </BentoCell>
        <BentoCell
          label="Net settlements · 4 weeks"
          value={`+$${netSettled}K`}
          caption="Inflow vs. outflow"
        >
          {charts ? <SettlementChart /> : <DataTable spec={tables.settlements} />}
        </BentoCell>
        <BentoCell
          label="Reserve allocation"
          value={`$${(reserveTotal / 1000).toFixed(2)}M`}
          caption="4.42% weighted APY"
        >
          {charts ? <ReserveChart /> : <DataTable spec={tables.reserves} />}
        </BentoCell>
        <BentoCell
          label="Settlement corridors"
          value={usd(corridorNet)}
          caption="Protected Reserve Intact"
          captionTone="caution"
        >
          <DataTable spec={tables.corridors} />
        </BentoCell>
      </div>
    </section>
  );
}

export default ArtifactPanel;
