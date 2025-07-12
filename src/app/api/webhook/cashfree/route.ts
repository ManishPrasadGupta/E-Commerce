import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order.model";
import { dbConnect } from "@/lib/db";
import nodemailer from "nodemailer";

// Helper to verify Cashfree webhook signature
function verifyCashfreeSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const computed = crypto.createHmac("sha256", secret).update(body).digest("base64");
  return computed === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-webhook-signature"); // Cashfree signature header
    const secret = process.env.CASHFREE_WEBHOOK_SECRET!;

    // Verify Cashfree webhook signature
    if (!verifyCashfreeSignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    await dbConnect();

    // Cashfree event for payment success (PG_PAYMENT_SUCCESS)
    if (event.event === "PAYMENT_SUCCESS_WEBHOOK" || event.event === "PAYMENT_SUCCESS") {
      const payment = event.data?.payment;
      const order_id = payment?.order_id;

      const order = await Order.findOneAndUpdate(
        { cashfreeOrderId: order_id },
        {
          cashfreePaymentId: payment?.payment_id,
          status: "completed",
        }
      ).populate([
        { path: "userId", select: "email" },
        { path: "productId", select: "name" },
      ]);

      if (order) {
        // Send email confirmation
        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
          },
        });

        await transporter.sendMail({
          from: '"Electech" <electech@gmail.com>',
          to: order.userId.email,
          subject: "Payment Confirmation - Electech",
          text: `
Thank you for your purchase!

Order Details:
- Order ID: ${order._id.toString().slice(-6)}
- Product: ${order.productId.name}
- Version: ${order.variant.type}
- License: ${order.variant.license}
- Price: $${order.amount.toFixed(2)}

Your order is now available in your orders page.
Thank you for shopping with Shiwam Electronics!
          `.trim(),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Cashfree webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}