/*
 * Guardian reserve-floor evaluation, mirroring the Auditor/Arbiter rules in
 * SnippyCodes/Can-I-Buy-It-: never let a discretionary purchase push the
 * liquid balance below the $500 floor; route to PayPal Pay in 4 when only
 * the first installment keeps the floor intact.
 */

export const RESERVE_FLOOR = 500;
export const PAY_IN_4_MIN = 30;
export const PAY_IN_4_MAX = 1500;

export interface Persona {
  id: string;
  name: string;
  label: string;
  balance: number;
  note: string;
}

export const personas: Persona[] = [
  {
    id: "michael",
    name: "Michael Buyer",
    label: "Healthy",
    balance: 3500,
    note: "Room for discretionary spend.",
  },
  {
    id: "demo",
    name: "Sandbox Demo",
    label: "Default",
    balance: 1850,
    note: "Large purchases route to Pay in 4.",
  },
  {
    id: "emma",
    name: "Emma Savings",
    label: "Tight reserve",
    balance: 550,
    note: "Pay in 4 triggers above $50.",
  },
  {
    id: "james",
    name: "James Student",
    label: "Overdraft risk",
    balance: 200,
    note: "Already under the floor. Discretionary spend is declined.",
  },
];

export const DEFAULT_PERSONA_ID = "demo";

export function getPersona(id: string): Persona {
  return personas.find((p) => p.id === id) ?? personas[1];
}

export type Verdict = "safe" | "payIn4" | "blocked";

export interface Evaluation {
  verdict: Verdict;
  price: number;
  balance: number;
  afterFull: number;
  installment: number;
  afterFirstInstallment: number;
  payIn4Eligible: boolean;
  headline: string;
  explanation: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function evaluatePurchase(price: number, balance: number): Evaluation {
  const afterFull = round2(balance - price);
  const installment = round2(price / 4);
  const afterFirstInstallment = round2(balance - installment);
  const payIn4Eligible = price >= PAY_IN_4_MIN && price <= PAY_IN_4_MAX;

  if (afterFull >= RESERVE_FLOOR) {
    return {
      verdict: "safe",
      price,
      balance,
      afterFull,
      installment,
      afterFirstInstallment,
      payIn4Eligible,
      headline: "Safe to buy in full",
      explanation: `Paying ${usd(price)} upfront leaves ${usd(afterFull)}, which is ${usd(afterFull - RESERVE_FLOOR)} above the $500 reserve floor.`,
    };
  }

  if (payIn4Eligible && afterFirstInstallment >= RESERVE_FLOOR) {
    return {
      verdict: "payIn4",
      price,
      balance,
      afterFull,
      installment,
      afterFirstInstallment,
      payIn4Eligible,
      headline: "Use PayPal Pay in 4",
      explanation: `Paying in full drops you to ${usd(afterFull)}, below the floor. Pay in 4 charges ${usd(installment)} today and keeps ${usd(afterFirstInstallment)} liquid.`,
    };
  }

  return {
    verdict: "blocked",
    price,
    balance,
    afterFull,
    installment,
    afterFirstInstallment,
    payIn4Eligible,
    headline: "Blocked by reserve floor",
    explanation: !payIn4Eligible
      ? `Paying in full drops you to ${usd(afterFull)}. Pay in 4 only covers purchases from $30 to $1,500, so Guardian won't stage this order.`
      : `Even a ${usd(installment)} first installment leaves ${usd(afterFirstInstallment)}, below the $500 floor. Guardian won't stage this order.`,
  };
}

export interface Installment {
  label: string;
  date: string;
  amount: number;
}

/* Four bi-weekly installments starting today, 0% APR. */
export function payIn4Schedule(price: number, from = new Date()): Installment[] {
  const base = Math.floor((price / 4) * 100) / 100;
  const last = round2(price - base * 3);
  return [0, 1, 2, 3].map((i) => {
    const d = new Date(from);
    d.setDate(d.getDate() + i * 14);
    return {
      label: i === 0 ? "Today" : `Week ${i * 2}`,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: i === 3 ? last : base,
    };
  });
}

export function usd(value: number, opts: { cents?: boolean } = {}) {
  const cents = opts.cents ?? !Number.isInteger(value);
  const abs = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
  return `${value < 0 ? "−" : ""}$${abs}`;
}

export const verdictTone: Record<Verdict, { text: string; dot: string; chip: string }> = {
  safe: {
    text: "text-gain",
    dot: "bg-gain",
    chip: "border-gain/25 bg-gain/10 text-gain",
  },
  payIn4: {
    text: "text-caution",
    dot: "bg-caution",
    chip: "border-caution/25 bg-caution/10 text-caution",
  },
  blocked: {
    text: "text-loss",
    dot: "bg-loss",
    chip: "border-loss/25 bg-loss/10 text-loss",
  },
};

export function verdictShort(e: Evaluation) {
  if (e.verdict === "safe") return "Safe in full";
  if (e.verdict === "payIn4") return `Pay in 4 · ${usd(e.installment, { cents: true })} today`;
  return "Blocked";
}
