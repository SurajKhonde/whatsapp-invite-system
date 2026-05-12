// hooks/usePricing.ts

import { useGetPricingConfigQuery, useCalculatePricingMutation } from "@/store/apiSlice";

export type MessageType = "text_only" | "image_only" | "image_and_text";
export const MESSAGE_TYPES = {
  TEXT_ONLY: "text_only" as const,
  IMAGE_ONLY: "image_only" as const,
  IMAGE_AND_TEXT: "image_and_text" as const,
} as const;

export interface PricingBreakdown {
  baseCost: number;
  perGuestCost: number;
  perGuestTotal: number;
  subtotal: number;
  platformFee: number;
  platformFeePercent: number;
  total: number;
  discount?: number;
  finalTotal: number;
}

export interface PricingConfig {
  id: string;
  message_type: MessageType;
  display_name: string;
  description: string;
  base_cost: number;
  per_guest_cost: number;
  platform_fee_percentage: number;
  includes_image_generation: boolean;
  includes_priority_support: boolean;
  includes_analytics: boolean;
  is_featured: boolean;
}

/**
 * Hook to fetch pricing config and calculate pricing
 */
export const usePricing = (messageType: MessageType, guestCount: number = 0) => {
  // Fetch pricing config from backend
  const { data: pricingConfigResponse, isLoading, isError } = useGetPricingConfigQuery(messageType);
  
  const pricingConfig = pricingConfigResponse?.data as PricingConfig | undefined;

  // Calculate pricing locally
  const calculatePricing = (): PricingBreakdown => {
    if (!pricingConfig || guestCount === 0) {
      return {
        baseCost: 0,
        perGuestCost: 0,
        perGuestTotal: 0,
        subtotal: 0,
        platformFee: 0,
        platformFeePercent: 0,
        total: 0,
        finalTotal: 0,
      };
    }

    const baseCost = pricingConfig.base_cost || 0;
    const perGuestCost = pricingConfig.per_guest_cost || 0;
    const platformFeePercent = pricingConfig.platform_fee_percentage || 0;

    const perGuestTotal = perGuestCost * guestCount;
    const subtotal = baseCost + perGuestTotal;
    const platformFee = (subtotal * platformFeePercent) / 100;
    const total = subtotal + platformFee;

    return {
      baseCost: Math.round(baseCost * 100) / 100,
      perGuestCost: Math.round(perGuestCost * 100) / 100,
      perGuestTotal: Math.round(perGuestTotal * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      platformFeePercent,
      total: Math.round(total * 100) / 100,
      finalTotal: Math.round(total * 100) / 100,
    };
  };

  const pricing = calculatePricing();

  return {
    pricingConfig,
    pricing,
    isLoading,
    isError,
    messageType,
    guestCount,
  };
};

/**
 * Hook to get message type based on template
 */
export const useMessageType = (template: any): MessageType => {
  if (!template) return MESSAGE_TYPES.TEXT_ONLY;
  
  // Determine message type based on template properties
  if (template.hasImage) {
    return MESSAGE_TYPES.IMAGE_AND_TEXT;
  }
  
  return MESSAGE_TYPES.TEXT_ONLY;
};