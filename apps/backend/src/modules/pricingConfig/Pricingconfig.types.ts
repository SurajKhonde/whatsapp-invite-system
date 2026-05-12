// File: apps/backend/src/types/pricingConfig.types.ts

export type MessageType = "text_only" | "image_only" | "image_and_text";

// Import from schema
import { pricingConfig } from "@/db/schema/pricing.schema";

export type PricingConfig = typeof pricingConfig.$inferSelect;
export type PricingConfigInsert = typeof pricingConfig.$inferInsert;

export interface PricingConfigDTO {
  id: string;
  messageType: MessageType;
  displayName: string;
  description: string | null;
  baseCostPaise: string;
  profitPercent: string;
  baseCost: string | null;
  perGuestCost: string | null;
  platformFeePercentage: string | null;
  includesImageGeneration: boolean;
  includesPrioritySupport: boolean;
  includesAnalytics: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPricingConfigParams {
  messageType: MessageType;
}

export interface CalculatePricingRequest {
  message_type: MessageType;
  guest_count: number;
}

export interface CalculatePricingResponse {
  message_type: MessageType;
  guest_count: number;
  base_cost: number;
  per_guest_cost: number;
  per_guest_total: number;
  subtotal: number;
  platform_fee_percentage: number;
  platform_fee: number;
  total: number;
}

export interface PricingConfigResponse {
  success: boolean;
  data: PricingConfigDTO;
}

export interface AllPricingConfigResponse {
  success: boolean;
  data: PricingConfigDTO[];
}

export interface CalculatePricingSuccessResponse {
  success: boolean;
  data: CalculatePricingResponse;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}