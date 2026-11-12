import { verdictShort, verdictTone, type Evaluation } from "./evaluate";

export function VerdictBadge({
  evaluation,
  size = "sm",
  label,
}: {
  evaluation: Evaluation;
  size?: "sm" | "md";
  label?: string;
}) {
  const tone = verdictTone[evaluation.verdict];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap ${tone.chip} ${
        size === "md" ? "h-7 px-3 text-[12px]" : "h-6 px-2.5 text-[11px]"
      }`}
    >
      <span className={`size-1.5 rounded-full ${tone.dot}`} />
      {label ?? verdictShort(evaluation)}
    </span>
  );
}
