import { RESERVE_FLOOR, usd, type Evaluation } from "./evaluate";

interface ReserveMeterProps {
  evaluation: Evaluation;
  /** Which payment path to visualise. Defaults to the Guardian recommendation. */
  mode?: "full" | "payIn4";
  compact?: boolean;
}

/*
 * Horizontal liquidity bar: what stays liquid, what leaves today, and where
 * the $500 floor sits on the same scale.
 */
export function ReserveMeter({ evaluation, mode, compact = false }: ReserveMeterProps) {
  const path = mode ?? (evaluation.verdict === "payIn4" ? "payIn4" : "full");
  const { balance } = evaluation;
  const remaining = path === "payIn4" ? evaluation.afterFirstInstallment : evaluation.afterFull;
  const breaches = remaining < RESERVE_FLOOR;

  const max = Math.max(balance, RESERVE_FLOOR * 1.25);
  const pct = (v: number) => `${(Math.min(Math.max(v, 0), max) / max) * 100}%`;
  const keptEnd = Math.max(remaining, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-900 ring-1 ring-zinc-800 ring-inset">
        <div
          className="absolute inset-y-0 left-0 rounded-l-full bg-zinc-300 transition-[width] duration-300"
          style={{ width: pct(keptEnd) }}
        />
        <div
          className={`absolute inset-y-0 transition-[left,width] duration-300 ${breaches ? "bg-loss/70" : "bg-zinc-600"}`}
          style={{
            left: pct(keptEnd),
            width: `calc(${pct(balance)} - ${pct(keptEnd)})`,
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 3px, rgba(9,9,11,0.35) 3px 5px)",
          }}
        />
        <div
          className="absolute inset-y-[-2px] w-px bg-zinc-50"
          style={{ left: pct(RESERVE_FLOOR) }}
          aria-hidden="true"
        />
      </div>
      {!compact && (
        <div className="relative h-4 text-[10.5px] tabular-nums text-zinc-500">
          <span className="absolute left-0">$0</span>
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap text-zinc-300"
            style={{ left: pct(RESERVE_FLOOR) }}
          >
            $500 floor
          </span>
          <span className="absolute right-0">{usd(balance)}</span>
        </div>
      )}
      <p className="sr-only">
        Balance {usd(balance)}. After this payment {usd(remaining)} remains,{" "}
        {breaches ? "below" : "above"} the $500 floor.
      </p>
    </div>
  );
}
