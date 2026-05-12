import crypto from "crypto";
import { razorpay } from "./razorpay";
import { AppError } from "@core/errors/AppError";
import { db } from "@/db/index";
import { payments } from "@/db/schema/payment.schema";
import { pricingConfig } from "@/db/schema/pricing.schema";
import { eq } from "drizzle-orm";

// ─────────────────────────────────────────────
// STEP 1 — Create Order
// ─────────────────────────────────────────────
export const createOrder = async (
  userId: string,
  messageType: string,
  guestCount: number
) => {
  // 1. Fetch pricing config
  const [pricing] = await db
    .select()
    .from(pricingConfig)
    .where(eq(pricingConfig.messageType, messageType));

  if (!pricing || !pricing.isActive) {
    throw new AppError(
      "Invalid or unavailable message type",
      400
    );
  }


  const baseCostPaise = Number(
    pricing.baseCostPaise
  );


  const perGuestCostPaise = Math.round(
    Number(pricing.perGuestCost) * 100
  );

  const subtotalPaise =
    baseCostPaise +
    perGuestCostPaise * guestCount;

  // platform fee
  const platformFeePaise = Math.round(
    subtotalPaise *
      (Number(
        pricing.platformFeePercentage
      ) /
        100)
  );


  const totalAmountPaise =subtotalPaise + platformFeePaise;


  let razorpayOrder;

  try {
    razorpayOrder =
      await razorpay.orders.create({
        amount: totalAmountPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          userId,
          messageType,
          guestCount: String(guestCount),
        },
      });
  } catch (razorpayErr: any) {
    console.error(
      "Razorpay raw error:",
      razorpayErr
    );

    console.error(
      "Razorpay error message:",
      razorpayErr?.message
    );

    console.error(
      "Razorpay error statusCode:",
      razorpayErr?.statusCode
    );

    console.error(
      "Razorpay error code:",
      razorpayErr?.error?.code
    );

    console.error(
      "Razorpay error description:",
      razorpayErr?.error?.description
    );

    console.error(
      "Razorpay full JSON:",
      JSON.stringify(
        razorpayErr,
        Object.getOwnPropertyNames(
          razorpayErr
        )
      )
    );

    throw new AppError(
      razorpayErr?.error?.description ||
        razorpayErr?.message ||
        "Razorpay order creation failed",
      razorpayErr?.statusCode || 500
    );
  }

  await db.insert(payments).values({
    userId,

    orderId: razorpayOrder.id,

    razorpayOrderId:
      razorpayOrder.id,

    amount: String(
      (totalAmountPaise / 100).toFixed(
        2
      )
    ),

    currency: "INR",

    messageType,

    guestCount,

    baseCostPaise: String(
      baseCostPaise
    ),

    pricePerMessagePaise: String(
      perGuestCostPaise
    ),

    totalAmountPaise: String(
      totalAmountPaise
    ),

    status: "created",
  });

  // ─────────────────────────────────────────────
  // 5. RETURN TO FRONTEND
  // ─────────────────────────────────────────────

  return {
    orderId: razorpayOrder.id,

    amount: totalAmountPaise,

    currency: "INR",

    keyId:
      process.env.RAZORPAY_KEY_ID,

    messageType,

    guestCount,

    pricePerMessagePaise:
      perGuestCostPaise,

    totalAmountPaise,

    pricingBreakdown: {
      baseCostPaise,
      perGuestCostPaise,
      subtotalPaise,
      platformFeePaise,
      totalAmountPaise,
    },
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
  // 1. Find order
  const [existingOrder] = await db
    .select()
    .from(payments)
    .where(
      eq(
        payments.razorpayOrderId,
        razorpay_order_id
      )
    );

  if (!existingOrder) {
    throw new AppError(
      "Order not found",
      404
    );
  }

  // 2. Ownership check
  if (
    existingOrder.userId !== userId
  ) {
    throw new AppError(
      "Unauthorized",
      403
    );
  }

  // 3. Verify signature
  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env
          .RAZORPAY_KEY_SECRET!
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

  if (
    expectedSignature !==
    razorpay_signature
  ) {
    await db
      .update(payments)
      .set({
        status: "failed",

        errorDescription:
          "Signature mismatch",

        updatedAt: new Date(),
      })
      .where(
        eq(
          payments.razorpayOrderId,
          razorpay_order_id
        )
      );

    throw new AppError(
      "Payment verification failed",
      400
    );
  }

  // 4. Mark payment as paid
  await db
    .update(payments)
    .set({
      status: "paid",

      paymentId:
        razorpay_payment_id,

      razorpayPaymentId:
        razorpay_payment_id,

      signature:
        razorpay_signature,

      razorpaySignature:
        razorpay_signature,

      updatedAt: new Date(),
    })
    .where(
      eq(
        payments.razorpayOrderId,
        razorpay_order_id
      )
    );

  // 5. Amount conversion
  const totalAmountPaise =
    existingOrder.totalAmountPaise
      ? Number(
          existingOrder.totalAmountPaise
        )
      : 0;

  const totalPaidRupees = (
    totalAmountPaise / 100
  ).toFixed(2);

  return {
    success: true,

    messageType:
      existingOrder.messageType,

    guestCount:
      existingOrder.guestCount,

    totalPaid: `₹${totalPaidRupees}`,

    paymentId:
      razorpay_payment_id,
  };
};

// ─────────────────────────────────────────────
// STEP 3 — Razorpay Webhook
// ─────────────────────────────────────────────

export const handleWebhook = async (
  rawBody: Buffer,
  razorpaySignature: string
) => {
  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env
          .RAZORPAY_WEBHOOK_SECRET!
      )
      .update(rawBody)
      .digest("hex");

  if (
    expectedSignature !==
    razorpaySignature
  ) {
    throw new AppError(
      "Invalid webhook signature",
      400
    );
  }

  const event = JSON.parse(
    rawBody.toString()
  );

  switch (event.event) {
    case "payment.captured": {
      const payment =
        event.payload.payment.entity;

      await db
        .update(payments)
        .set({
          status: "paid",

          paymentId: payment.id,

          razorpayPaymentId:
            payment.id,

          updatedAt: new Date(),
        })
        .where(
          eq(
            payments.razorpayOrderId,
            payment.order_id
          )
        );

      console.log(
        `✅ Payment captured: ${payment.id}`
      );

      break;
    }

    case "payment.failed": {
      const payment =
        event.payload.payment.entity;

      await db
        .update(payments)
        .set({
          status: "failed",

          errorCode:
            payment.error_code,

          errorDescription:
            payment.error_description,

          updatedAt: new Date(),
        })
        .where(
          eq(
            payments.razorpayOrderId,
            payment.order_id
          )
        );

      console.log(
        `❌ Payment failed: ${payment.id}`
      );

      break;
    }

    default:
      console.log(
        `Unhandled webhook event: ${event.event}`
      );
  }

  return {
    received: true,
  };
};

// ─────────────────────────────────────────────
// GET USER LATEST PAYMENT
// ─────────────────────────────────────────────

export const getUserLatestPayment =
  async (userId: string) => {
    const [latestPayment] =
      await db
        .select()
        .from(payments)
        .where(
          eq(payments.userId, userId)
        )
        .orderBy(payments.createdAt)
        .limit(1);

    if (
      !latestPayment ||
      latestPayment.status !== "paid"
    ) {
      return null;
    }

    const totalAmountPaise =
      latestPayment.totalAmountPaise
        ? Number(
            latestPayment.totalAmountPaise
          )
        : 0;

    const totalPaidRupees = (
      totalAmountPaise / 100
    ).toFixed(2);

    return {
      messageType:
        latestPayment.messageType,

      guestCount:
        latestPayment.guestCount,

      totalPaid: `₹${totalPaidRupees}`,

      paidAt:
        latestPayment.updatedAt,
    };
  };