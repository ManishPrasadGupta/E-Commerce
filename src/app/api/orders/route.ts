import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, variant } = await req.json();

    console.log("Creating order for productId:", productId, "variant:", variant);
    
    if (!productId || !variant) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create Cashfree order via API (sandbox)
    const CASHFREE_APP_ID = process.env.CASHFREE_TEST_APP_ID!;
    const CASHFREE_SECRET_KEY = process.env.CASHFREE_TEST_SECRET_KEY!;
    const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg/orders";

    // Prepare order details
    const orderId = `order_${Date.now()}`;
    const orderAmount = variant.price;
    const customerName = session.user.name || "Customer";
    const customerEmail = session.user.email || "noemail@example.com";
    // const customerPhone = session.user.phone || "9999999999"; // Adjust as needed

    // Call Cashfree to create order
    const cfRes = await fetch(CASHFREE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: session.user._id,
          customer_name: customerName,
          customer_email: customerEmail,
          // customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?order_id={order_id}`,
        },
        order_note: "Order placed on Electech",
      }),
    });
console.log("cashfree response", cfRes)
    const data = await cfRes.json();
    if (!cfRes.ok || !data.payment_session_id) {
      return NextResponse.json({ error: "Failed to create Cashfree order", details: data }, { status: 500 });
    }

    // Save order in MongoDB
    const newOrder = await Order.create({
      userId: session.user._id,
      productId,
      variant,
      cashfreeOrderId: orderId,
      amount: orderAmount,
      status: "pending",
      cashfreePaymentId: null,
    });

    return NextResponse.json({
      orderId: orderId,
      paymentSessionId: data.payment_session_id,
      dbOrderId: newOrder._id,
      amount: orderAmount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}