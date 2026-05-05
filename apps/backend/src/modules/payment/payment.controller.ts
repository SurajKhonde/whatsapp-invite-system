import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@utils/response";
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getUserLatestPayment, // ✅ renamed from getUserActivePlan
} from "./payment.service";
import { requireUser } from "@middlewares/requireUser";

// POST /api/payment/create-order
export const createPaymentOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requireUser(req);
    const userId = user.userId;

    const { messageType, guestCount } = req.body as {
      messageType: string;
      guestCount: number;
    };

    if (!messageType) throw new Error("messageType is required");
    if (!guestCount) throw new Error("guestCount is required");

    const order = await createOrder(userId, messageType, guestCount);

    return sendResponse({ res, statusCode: 201, data: order });
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/verify
export const verifyPaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requireUser(req);
    const userId = user.userId;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification fields");
    }

    const result = await verifyPayment(
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    return sendResponse({ res, statusCode: 200, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/webhook
// Must use raw body — DO NOT use express.json() for this route
export const webhookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      return res.status(400).json({ error: "Missing signature" });
    }

    const result = await handleWebhook(req.body as Buffer, signature);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/payment/my-payment
export const getMyPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requireUser(req);
    const userId = user.userId;

    const payment = await getUserLatestPayment(userId);

    return sendResponse({
      res,
      statusCode: 200,
      data: payment ?? { message: "No payment found" },
    });
  } catch (err) {
    next(err);
  }
};