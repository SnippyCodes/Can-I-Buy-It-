import { NextRequest, NextResponse } from "next/server";
import { createAndSendInvoice, sendExistingInvoice, recordInvoicePayment } from "@/lib/paypal-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, invoiceId, recipientEmail, amount, description, currency = "USD", note } = body;

    // 1. Direct Pay / Settle Action
    if (action === "pay" && invoiceId) {
      const paymentResult = await recordInvoicePayment({
        invoiceId,
        amount: Number(amount) || 100,
        currency,
        note: note || "Paid via PayPal Guardian Autonomous Settlement",
      });
      return NextResponse.json(paymentResult);
    }

    // 2. Dispatch existing draft invoice
    if (action === "send" && invoiceId && invoiceId.startsWith("INV2-")) {
      const sendResult = await sendExistingInvoice(invoiceId);
      return NextResponse.json(sendResult);
    }

    // 3. Create and send new invoice
    if (!recipientEmail || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "recipientEmail and positive amount are required" },
        { status: 400 }
      );
    }

    const invoice = await createAndSendInvoice({
      recipientEmail,
      amount: Number(amount),
      description: description || "Consulting Deliverables",
      currency,
      note,
    });

    return NextResponse.json(invoice);
  } catch (err: any) {
    console.error("PayPal invoice route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process invoice" },
      { status: 500 }
    );
  }
}

