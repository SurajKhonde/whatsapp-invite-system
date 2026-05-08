import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { templates } from "./template.schema";

export type Template = InferSelectModel<typeof templates>;
export type NewTemplate = InferInsertModel<typeof templates>;

// Type definitions for the application

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Event Types
export interface CreateEventRequest {
  eventName: string;
  eventType: string;
  groomName?: string;
  brideName?: string;
  eventDate: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  totalGuests: number;
  templateId: string;
  messageType: "text_only" | "image_only" | "image_and_text";
  guestIds: string[];
  imageUrl?: string;
}

export interface EventResponse {
  id: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  totalGuests: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  status: "draft" | "sent" | "completed" | "failed";
  messageType: string;
  imageUrl?: string;
  templateName: string;
  amountPaid?: number;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

// Guest Types
export interface GuestRequest {
  name: string;
  phoneNumber: string;
  email?: string;
  countryCode?: string;
}

export interface GuestResponse extends GuestRequest {
  id: string;
  userId: string;
  isWhatsappVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Template Types
export interface TemplateResponse {
  id: string;
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  whatsappTemplateId?: string;
  whatsappTemplateName?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface CreateOrderRequest {
  messageType: string;
  guestCount: number;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentResponse {
  success: boolean;
  orderId: string;
  paymentId: string;
}

// Image Generation Types
export interface GenerateImageRequest {
  eventType: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
}

export interface ImageStatusResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  imageUrl?: string;
  error?: string;
}

// WhatsApp Event Types
export interface CreateWhatsappEventRequest {
  whatsappTemplateId: string;
  messageType: string;
  templateParams: Record<string, any>;
  imageUrl?: string;
  guestIds: string[];
  paymentId: string;
}

export interface WhatsappEventStatusResponse {
  eventId: string;
  status: "pending" | "sending" | "completed" | "failed";
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  pendingCount: number;
}

// Pricing Types
export interface PricingCalculation {
  baseCost: number;
  perGuestCost: number;
  totalGuests: number;
  subtotal: number;
  platformFeePercentage: number;
  platformFee: number;
  total: number;
}

// Error Response
export interface ErrorResponse {
  success: false;
  error: string;
  details?: Record<string, any>;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}