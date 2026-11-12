import { HistorySession } from "./types";

export const PREVIOUS_CHAT_SESSIONS: HistorySession[] = [
  {
    id: "session-8492",
    title: "Sandbox Dispute Audit #8492",
    timestamp: "14 min ago",
    dateGroup: "today",
    messageCount: 4,
    agentId: "guardian-core",
    preview: "Verified PayPal order #8492 for $850.00. Buffer impact 0%, risk tier MINIMAL.",
    messages: [
      {
        id: "msg-101",
        sender: "user",
        text: "Check PayPal sandbox transaction safety for order #8492.",
        timestamp: "11:01 AM",
      },
      {
        id: "msg-102",
        sender: "assistant",
        agentId: "guardian-core",
        text: "I analyzed PayPal Sandbox Order **#8492** against your current liquidity and risk threshold. Everything is fully authorized and safe for settlement.",
        timestamp: "11:01 AM",
        modelBadge: "Model Fusion",
        latencyMs: 312,
        actionCard: {
          type: "order_verification",
          orderData: {
            orderId: "8492-PP-SANDBOX",
            amount: 850.0,
            currency: "USD",
            merchant: "Electronics Vendor (Channel3 Verified)",
            status: "APPROVED",
            safetyScore: 98,
            riskTier: "MINIMAL",
            disputeProbability: 0.18,
            bufferImpact: 0,
            postOrderBalance: 1850.0,
            payIn4Recommended: false,
          },
        },
      },
    ],
  },
  {
    id: "session-contract-sla",
    title: "Merchant Agreement Liability & Escrow Terms",
    timestamp: "2 hours ago",
    dateGroup: "today",
    messageCount: 6,
    agentId: "escrow-agent",
    preview: "Milestone escrow verification for vendor contract #SLA-2026 ($24,500 total).",
    messages: [
      {
        id: "msg-201",
        sender: "user",
        text: "Summarize B2B vendor contract #SLA-2026, highlighting escrow release milestones and liability clauses.",
        timestamp: "09:14 AM",
      },
      {
        id: "msg-202",
        sender: "assistant",
        agentId: "escrow-agent",
        text: "I completed a full structural audit of **Vendor Service Agreement #SLA-2026**. The contract contains 4 milestone phases protected by PayPal Escrow smart conditions.",
        timestamp: "09:14 AM",
        modelBadge: "Claude 3.5 Sonnet",
        latencyMs: 540,
        actionCard: {
          type: "contract_summary",
          contractData: {
            contractId: "SLA-2026-CLOUD-OPS",
            title: "Global Infrastructure & CDN Support SLA",
            counterparty: "Apex Cloud Services LLC",
            escrowValue: 24500.0,
            currency: "USD",
            milestonesCount: 4,
            verifiedMilestones: 2,
            liabilityCap: 50000.0,
            disputeResolution: "PayPal Enterprise Arbitration (Fast Track 7-Day)",
            complianceScore: 94,
            keyRisks: [
              "Phase 3 milestone release depends on 99.95% uptime verification logs.",
              "Section 14 requires mutual 30-day notice for fee revisions.",
            ],
          },
        },
      },
    ],
  },
  {
    id: "session-dispute-batch",
    title: "Dispute Probability & Chargeback Defense",
    timestamp: "Yesterday",
    dateGroup: "previous7Days",
    messageCount: 5,
    agentId: "risk-analyst",
    preview: "Sampled 1,420 merchant transactions. Projected chargeback rate 0.28% (Healthy).",
    messages: [
      {
        id: "msg-301",
        sender: "user",
        text: "Run dispute probability simulation and merchant chargeback risk audit on recent transactions.",
        timestamp: "Yesterday 4:32 PM",
      },
      {
        id: "msg-302",
        sender: "assistant",
        agentId: "risk-analyst",
        text: "I evaluated **1,420 transaction records** across your connected PayPal accounts. Your risk posture is significantly stronger than the industry benchmark.",
        timestamp: "Yesterday 4:32 PM",
        modelBadge: "PayPal Neuro v4",
        latencyMs: 410,
        actionCard: {
          type: "dispute_risk",
          disputeData: {
            accountOrBatch: "Batch #TXN-OCT-2026",
            transactionsSampled: 1420,
            projectedChargebackRate: 0.28,
            industryBenchmark: 1.15,
            overallRiskLevel: "LOW",
            highRiskFlags: [
              "2 cross-border orders from unconfirmed IPs flagged for re-verification",
            ],
            recommendedMitigations: [
              "Require 3D Secure / OTP for transactions over $1,200",
              "Maintain $500 safety buffer for subscription renewals",
            ],
            safeBufferPreserved: true,
          },
        },
      },
    ],
  },
  {
    id: "session-webhook-health",
    title: "Webhook HMAC Signature & Latency Audit",
    timestamp: "2 days ago",
    dateGroup: "previous7Days",
    messageCount: 4,
    agentId: "code-audit",
    preview: "CHECKOUT.ORDER.APPROVED verified. HMAC-SHA256 valid, 42ms processing latency.",
    messages: [
      {
        id: "msg-401",
        sender: "user",
        text: "Inspect recent PayPal CHECKOUT.ORDER.APPROVED webhook events and verify HMAC-SHA256 signature health.",
        timestamp: "Nov 6, 2:10 PM",
      },
      {
        id: "msg-402",
        sender: "assistant",
        agentId: "code-audit",
        text: "All recent webhook events originating from `api-m.sandbox.paypal.com` have passed cryptographic signature verification.",
        timestamp: "Nov 6, 2:10 PM",
        modelBadge: "Model Fusion",
        latencyMs: 198,
        actionCard: {
          type: "webhook_inspect",
          webhookData: {
            eventId: "WH-948102-PAYPAL-SANDBOX",
            eventType: "PAYMENT.CAPTURE.COMPLETED",
            timestamp: "2026-11-06T14:09:55Z",
            latencyMs: 42,
            signatureStatus: "VALID",
            algorithm: "SHA256withRSA / HMAC-SHA256",
            payloadSummary: {
              resourceType: "capture",
              resourceId: "CAP-88192-SANDBOX",
              status: "COMPLETED",
              merchantId: "MCH-GUARDIAN-01",
            },
            headers: {
              "paypal-auth-algo": "SHA256withRSA",
              "paypal-cert-url": "https://api-m.sandbox.paypal.com/v1/notifications/certs/CERT-1",
              "paypal-transmission-id": "trans-5f8910d-2026",
              "paypal-transmission-time": "2026-11-06T14:09:55Z",
            },
          },
        },
      },
    ],
  },
];

/* Canvas & Liquidity Artifact Data */
export interface Artifact {
  title: string;
  meta: string;
}

export const canvasArtifact: Artifact = {
  title: "Q3 Liquidity & Risk Canvas",
  meta: "Cash, settlements, reserves and corridors",
};

export const BUFFER_M = 0.5;
export const ACTUAL_THROUGH_DAY = 30;

export const cashSeries = [
  { day: 0, value: 1.85 },
  { day: 10, value: 1.97 },
  { day: 20, value: 2.18 },
  { day: 30, value: 2.38 },
  { day: 40, value: 2.29 },
  { day: 50, value: 2.61 },
  { day: 60, value: 2.89 },
  { day: 70, value: 3.02 },
  { day: 80, value: 3.24 },
  { day: 90, value: 3.45 },
];

export const settlementWeeks = [
  { week: "W1", inflow: 412, outflow: 230 },
  { week: "W2", inflow: 468, outflow: 258 },
  { week: "W3", inflow: 351, outflow: 257 },
  { week: "W4", inflow: 489, outflow: 240 },
];

export const reserveTranches = [
  { name: "Operating cash", amount: 1850, apy: "4.10%", liquidity: "Same day" },
  { name: "Covenant buffer", amount: 500, apy: "4.65%", liquidity: "Restricted" },
  { name: "Overnight repo", amount: 780, apy: "4.88%", liquidity: "Next day" },
  { name: "FX collateral", amount: 320, apy: "3.75%", liquidity: "Intraday" },
];

export const corridors = [
  { corridor: "US operating", net: 302400, coverage: "3.12×", status: "Verified" },
  { corridor: "EMEA SEPA", net: -68500, coverage: "2.44×", status: "Review" },
  { corridor: "Treasury repo", net: 350000, coverage: "4.05×", status: "Hedged" },
  { corridor: "APAC clearing", net: 151400, coverage: "2.89×", status: "Verified" },
];
