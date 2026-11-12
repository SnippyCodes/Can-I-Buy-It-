import { usd } from "../guardian/evaluate";

const W = 520;
const H = 150;
const PAD = { t: 12, r: 8, b: 22, l: 8 };

/* 90-day weekly lowest price with min/avg/high summary, as in the repo's price-history-chart. */
export function PriceHistoryChart({ history, current }: { history: number[]; current: number }) {
  const low = Math.min(...history);
  const high = Math.max(...history);
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  const span = Math.max(high - low, high * 0.04);
  const yMin = low - span * 0.25;
  const yMax = high + span * 0.25;

  const x = (i: number) => PAD.l + (i / (history.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  const line = history.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(history.length - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;
  const position = high === low ? 0.5 : (current - low) / (high - low);

  return (
    <div className="flex flex-col gap-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Price history, last 90 days">
        <defs>
          <linearGradient id="ph-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fafafa" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PAD.l} x2={W - PAD.r} y1={y(avg)} y2={y(avg)} stroke="#3f3f46" strokeDasharray="3 4" />
        <path d={area} fill="url(#ph-fill)" />
        <path d={line} fill="none" stroke="#e4e4e7" strokeWidth={1.5} strokeLinejoin="round" />
        <circle cx={x(history.length - 1)} cy={y(history[history.length - 1])} r={3.5} fill="#fafafa" />
        {["90d", "60d", "30d", "Today"].map((label, i) => (
          <text
            key={label}
            x={PAD.l + (i / 3) * (W - PAD.l - PAD.r)}
            y={H - 4}
            fill="#71717a"
            fontSize="10"
            textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"}
          >
            {label}
          </text>
        ))}
      </svg>

      <div>
        <div className="relative h-1.5 rounded-full bg-gradient-to-r from-gain/60 via-zinc-600 to-loss/60">
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-zinc-50"
            style={{ left: `${Math.min(Math.max(position, 0), 1) * 100}%` }}
          />
        </div>
        <div className="mt-2 grid grid-cols-3 text-[11px] tabular-nums">
          <span className="text-zinc-500">
            Low <span className="text-zinc-200">{usd(low)}</span>
          </span>
          <span className="text-center text-zinc-500">
            Avg <span className="text-zinc-200">{usd(Math.round(avg))}</span>
          </span>
          <span className="text-right text-zinc-500">
            High <span className="text-zinc-200">{usd(high)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
