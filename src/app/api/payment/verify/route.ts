import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
    } = body;

    let isValid = true;
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      isValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    // Update order status in Supabase
    try {
      const supabase = createAdminClient();
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          razorpay_payment_id,
        })
        .eq("order_number", orderNumber);
    } catch (dbErr) {
      console.warn("Database status update warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      orderNumber,
      paymentId: razorpay_payment_id,
    });
  } catch (error: unknown) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}
