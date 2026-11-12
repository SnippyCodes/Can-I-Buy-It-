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
  meta: "Cash, settlements, reserves, and spending channels",
};

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
