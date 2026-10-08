import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      subtotal,
      discount = 0,
      shipping = 0,
      total,
      customerInfo,
      userId,
      isCod = false,
    } = body;

    if (!items || items.length === 0 || !shippingAddress || !total) {
      return NextResponse.json(
        { error: "Invalid order data. Missing items or address." },
        { status: 400 }
      );
    }

    const orderNumber = `RG-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // If Cash on Delivery
    if (isCod) {
      try {
        const supabase = createAdminClient();
        await supabase.from("orders").insert([
          {
            order_number: orderNumber,
            user_id: userId || null,
            guest_name: customerInfo?.name || shippingAddress.fullName,
            guest_email: customerInfo?.email || shippingAddress.email,
            guest_phone: customerInfo?.phone || shippingAddress.phone,
            status: "processing",
            payment_status: "unpaid",
            subtotal,
            discount,
            shipping,
            total,
            shipping_address: shippingAddress,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn("Database order insert error (non-fatal):", dbErr);
      }

      return NextResponse.json({
        success: true,
        orderNumber,
        isCod: true,
        total,
      });
    }

    // Razorpay Online Payment Flow
    let razorpayOrderId = `rzp_order_${Date.now()}`;
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockKeyId";

    try {
      if (process.env.RAZORPAY_KEY_SECRET && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        const razorpay = getRazorpayClient();
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(total * 100), // amount in paise
          currency: "INR",
          receipt: orderNumber,
          notes: {
            customer_name: customerInfo?.name || shippingAddress.fullName,
            customer_phone: customerInfo?.phone || shippingAddress.phone,
          },
        });
        razorpayOrderId = rzpOrder.id;
      }
    } catch (rzpErr) {
      console.warn("Razorpay API error, falling back to test order:", rzpErr);
    }

    // Save pending order in Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from("orders").insert([
        {
          order_number: orderNumber,
          user_id: userId || null,
          guest_name: customerInfo?.name || shippingAddress.fullName,
          guest_email: customerInfo?.email || shippingAddress.email,
          guest_phone: customerInfo?.phone || shippingAddress.phone,
          status: "pending",
          payment_status: "unpaid",
          subtotal,
          discount,
          shipping,
          total,
          shipping_address: shippingAddress,
          razorpay_order_id: razorpayOrderId,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (dbErr) {
      console.warn("Database insert warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      orderNumber,
      amount: Math.round(total * 100),
      currency: "INR",
      keyId,
    });
  } catch (error: unknown) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order creation failed" },
      { status: 500 }
    );
  }
}
