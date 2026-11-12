export type SessionGroup = "TODAY" | "PREVIOUS 7 DAYS";

export interface Artifact {
  title: string;
  meta: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  time: string;
  text?: string;
  heading?: string;
  bullets?: string[];
  artifact?: Artifact;
}

export interface Session {
  id: string;
  title: string;
  group: SessionGroup;
  time: string;
  messages: Message[];
}

export const canvasArtifact: Artifact = {
  title: "Q3 Liquidity & Risk Canvas",
  meta: "Cash, settlements, reserves and corridors",
};

export const initialSessions: Session[] = [
  {
    id: "liquidity-stress",
    title: "90-day liquidity stress test",
    group: "TODAY",
    time: "14:22",
    messages: [
      {
        id: "ls-1",
        role: "user",
        time: "14:21",
        text: "Stress-test 90-day cash flow across the PayPal Sandbox and operating accounts. Flag any window where liquidity comes within 15% of the $500K covenant buffer.",
      },
      {
        id: "ls-2",
        role: "assistant",
        time: "14:22",
        heading: "No covenant breach projected",
        bullets: [
          "Ending balance reaches $3.45M on day 90, up 18.4% quarter over quarter.",
          "Tightest window is days 38–42, when EMEA supplier wires overlap card settlement lag. Headroom stays at least $640K above the buffer.",
          "Two high-velocity payout requests totaling $124K are held for dual approval.",
        ],
        artifact: canvasArtifact,
      },
    ],
  },
  {
    id: "wire-409",
    title: "Wire batch #409 review",
    group: "TODAY",
    time: "11:08",
    messages: [
      {
        id: "wb-1",
        role: "user",
        time: "11:06",
        text: "Check pending wire batch #409 against the approved vendor master.",
      },
      {
        id: "wb-2",
        role: "assistant",
        time: "11:08",
        heading: "14 of 15 wires verified",
        bullets: [
          "14 beneficiary accounts match settled payment history.",
          "Helios Cloud GmbH ($68,500) is held because its intermediary bank changed since the last payment.",
          "Operating reserve after release: $2.91M.",
        ],
        artifact: canvasArtifact,
      },
    ],
  },
  {
    id: "ach-returns",
    title: "ACH return rate audit",
    group: "PREVIOUS 7 DAYS",
    time: "Mon",
    messages: [
      {
        id: "ach-1",
        role: "user",
        time: "Mon 09:14",
        text: "Summarize ACH return rates by checkout cohort for the last 30 days.",
      },
      {
        id: "ach-2",
        role: "assistant",
        time: "Mon 09:15",
        heading: "Return rate within limits",
        bullets: [
          "Aggregate ACH return rate is 0.31%, below the 0.5% administrative threshold.",
          "Pre-authorization checks blocked $82.4K in high-risk instant checkouts.",
        ],
      },
    ],
  },
  {
    id: "fx-collar",
    title: "EUR/USD 60-day hedge",
    group: "PREVIOUS 7 DAYS",
    time: "Sat",
    messages: [
      {
        id: "fx-1",
        role: "user",
        time: "Sat 16:40",
        text: "Size our EUR/USD exposure for the next 60 days and propose a zero-cost collar.",
      },
      {
        id: "fx-2",
        role: "assistant",
        time: "Sat 16:41",
        heading: "Collar caps downside at $11.4K",
        bullets: [
          "Open EUR receivables total €1.15M, with $48K value at risk at 95% confidence.",
          "A 1.0720 / 1.0985 zero-cost collar limits downside to $11.4K.",
        ],
        artifact: canvasArtifact,
      },
    ],
  },
  {
    id: "affiliate",
    title: "Affiliate payout reconciliation",
    group: "PREVIOUS 7 DAYS",
    time: "Fri",
    messages: [
      {
        id: "af-1",
        role: "user",
        time: "Fri 10:02",
        text: "Reconcile affiliate commissions against settled sales volume.",
      },
      {
        id: "af-2",
        role: "assistant",
        time: "Fri 10:03",
        heading: "Reconciled with no variance",
        bullets: [
          "Payouts total $286.4K across 1,284 settled orders.",
          "$18.2K is reserved for refunds still inside the 14-day window.",
        ],
      },
    ],
  },
];

/* Canvas data. Real PayPal Guardian metrics ($500 sacred floor). */
export const BUFFER_M = 500.0;
export const ACTUAL_THROUGH_DAY = 30;

export const cashSeries = [
  { day: 0, value: 3485.0 },
  { day: 10, value: 5540.0 },
  { day: 20, value: 5210.0 },
  { day: 30, value: 6058.0 },
  { day: 40, value: 5890.0 },
  { day: 50, value: 7850.0 },
  { day: 60, value: 8616.0 },
  { day: 70, value: 8420.0 },
  { day: 80, value: 8750.0 },
  { day: 90, value: 8974.0 },
];

export const settlementWeeks = [
  { week: "W1", inflow: 0, outflow: 1285 },
  { week: "W2", inflow: 2200, outflow: 190 },
  { week: "W3", inflow: 0, outflow: 212 },
  { week: "W4", inflow: 2200, outflow: 105 },
];

export const reserveTranches = [
  { name: "Liquid Discretionary", amount: 3000, apy: "4.10%", liquidity: "Instant (Wallet)" },
  { name: "Sacred Reserve Floor", amount: 500, apy: "4.65%", liquidity: "Locked Floor" },
  { name: "30D AutoPay Commitments", amount: 1392, apy: "—", liquidity: "Escrowed for Bills" },
  { name: "Pay in 4 Available", amount: 1500, apy: "0% APR", liquidity: "Pre-Approved" },
];

export const corridors = [
  { corridor: "Housing & Living", net: -1200, coverage: "2.92× Floor", status: "Verified" },
  { corridor: "Direct Deposit Salary", net: 4400, coverage: "8.80× Floor", status: "Verified" },
  { corridor: "PayPal Retail Orders", net: -283.47, coverage: "1.57× Buffer", status: "Verified" },
  { corridor: "Cloud SaaS & Digital", net: -192, coverage: "3.94× Buffer", status: "Verified" },
];
