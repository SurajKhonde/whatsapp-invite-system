import crypto from "crypto";
import { razorpay } from "./razorpay";
import { AppError } from "@core/errors/AppError";
import { db } from "@/db/index";
import { payments } from "@/db/schema/payment.schema";
import { pricingConfig } from "@/db/schema/pricing.schema";
import { eq } from "drizzle-orm";
import { calculatePrice } from "@utils/pricing";

// ─────────────────────────────────────────────
// STEP 1 — Create Order
// ─────────────────────────────────────────────
export const createOrder = async (
  userId: string,
  messageType: string,  // 'whatsapp_text' | 'whatsapp_image'
  guestCount: number
) => {
  // 1. Fetch live pricing from DB
  const [pricing] = await db
    .select()
    .from(pricingConfig)
    .where(eq(pricingConfig.messageType, messageType));
console.log(pricing,'__________________>001')
  if (!pricing || !pricing.isActive) {
    throw new AppError("Invalid or unavailable message type", 400);
  }

  // 2. Calculate total
  const { pricePerMessagePaise, totalAmountPaise } = calculatePrice(
    Number(pricing.baseCostPaise),
    Number(pricing.profitPercent),
    guestCount
  );
console.log(pricePerMessagePaise, totalAmountPaise ,'__________________>002')
  // 3. Create Razorpay order
  let razorpayOrder;
try {
  razorpayOrder = await razorpay.orders.create({
    amount:   totalAmountPaise,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      userId,
      messageType,
      guestCount: String(guestCount),
    },
  });
  console.log(razorpayOrder, '__________________>003');
} catch (razorpayErr: any) {
  // Razorpay throws non-standard errors — extract manually
  console.error('Razorpay raw error:', razorpayErr);
  console.error('Razorpay error message:', razorpayErr?.message);
  console.error('Razorpay error statusCode:', razorpayErr?.statusCode);
  console.error('Razorpay error code:', razorpayErr?.error?.code);
  console.error('Razorpay error description:', razorpayErr?.error?.description);
  console.error('Razorpay full JSON:', JSON.stringify(razorpayErr, Object.getOwnPropertyNames(razorpayErr)));

  throw new AppError(
    razorpayErr?.error?.description || razorpayErr?.message || 'Razorpay order creation failed',
    razorpayErr?.statusCode || 500
  );
}

  // 5. Return to frontend
  return {
    orderId:              razorpayOrder.id,
    amount:               totalAmountPaise,
    currency:             "INR",
    keyId:                process.env.RAZORPAY_KEY_ID,
    messageType,
    guestCount,
    pricePerMessagePaise,
    totalAmountPaise,
  };
};

// ─────────────────────────────────────────────
// STEP 2 — Verify Payment
// ─────────────────────────────────────────────
export const verifyPayment = async (
  userId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  // 1. Find order in DB
  const [existingOrder] = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, razorpay_order_id));

  if (!existingOrder) {
    throw new AppError("Order not found", 404);
  }

  // 2. Belongs to this user?
  if (existingOrder.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  // 3. Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await db
      .update(payments)
      .set({ status: "failed", errorDescription: "Signature mismatch" })
      .where(eq(payments.orderId, razorpay_order_id));

    throw new AppError("Payment verification failed. Please contact support.", 400);
  }

  // 4. Mark as paid
  await db
    .update(payments)
    .set({
      status:    "paid",
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      updatedAt: new Date(),
    })
    .where(eq(payments.orderId, razorpay_order_id));

  return {
    success:      true,
    messageType:  existingOrder.messageType,
    guestCount:   existingOrder.guestCount,
    totalPaid:    `₹${(existingOrder.totalAmountPaise / 100).toFixed(2)}`,
    paymentId:    razorpay_payment_id,
  };
};

// ─────────────────────────────────────────────
// STEP 3 — Webhook (backup, fires even if browser closes)
// ─────────────────────────────────────────────
export const handleWebhook = async (
  rawBody: Buffer,
  razorpaySignature: string
) => {
  // 1. Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new AppError("Invalid webhook signature", 400);
  }

  const event = JSON.parse(rawBody.toString());

  switch (event.event) {
    case "payment.captured": {
      const payment = event.payload.payment.entity;

      await db
        .update(payments)
        .set({
          status:    "paid",
          paymentId: payment.id,
          updatedAt: new Date(),
        })
        .where(eq(payments.orderId, payment.order_id));

      console.log(`✅ Payment captured: ${payment.id}`);
      break;
    }

    case "payment.failed": {
      const payment = event.payload.payment.entity;

      await db
        .update(payments)
        .set({
          status:           "failed",
          errorCode:        payment.error_code,
          errorDescription: payment.error_description,
          updatedAt:        new Date(),
        })
        .where(eq(payments.orderId, payment.order_id));

      console.log(`❌ Payment failed: ${payment.id} — ${payment.error_description}`);
      break;
    }

    default:
      console.log(`Unhandled webhook event: ${event.event}`);
  }

  return { received: true };
};

// ─────────────────────────────────────────────
// HELPER — Get user's latest paid order
// Use this to check if user can send invites
// ─────────────────────────────────────────────
export const getUserLatestPayment = async (userId: string) => {
  const [latestPayment] = await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(payments.createdAt)
    .limit(1);

  if (!latestPayment || latestPayment.status !== "paid") {
    return null;
  }

  return {
    messageType:  latestPayment.messageType,
    guestCount:   latestPayment.guestCount,
    totalPaid:    `₹${(latestPayment.totalAmountPaise / 100).toFixed(2)}`,
    paidAt:       latestPayment.updatedAt,
  };
};