
import Decimal from "decimal.js";
import { pricingConfigRepository } from "./pricingConfig.repository";
import {
  MessageType,
  PricingConfigDTO,
  CalculatePricingRequest,
  CalculatePricingResponse,
} from "./Pricingconfig.types";


export class PricingConfigService {
  /**
   * Get pricing config by message type
   */
  async getPricingConfigByType(messageType: MessageType): Promise<PricingConfigDTO> {
    const config = await pricingConfigRepository.getByMessageType(messageType);

    if (!config) {
      throw new Error(`Pricing configuration not found for message type: ${messageType}`);
    }

    return this.mapToDTO(config);
  }

  /**
   * Get all active pricing configs
   */
  async getAllActivePricingConfigs(): Promise<PricingConfigDTO[]> {
    const configs = await pricingConfigRepository.getAllActive();
    return configs.map((config) => this.mapToDTO(config));
  }

  /**
   * Get all pricing configs
   */
  async getAllPricingConfigs(): Promise<PricingConfigDTO[]> {
    const configs = await pricingConfigRepository.getAll();
    return configs.map((config) => this.mapToDTO(config));
  }

  /**
   * Get featured pricing configs
   */
  async getFeaturedPricingConfigs(): Promise<PricingConfigDTO[]> {
    const configs = await pricingConfigRepository.getFeatured();
    return configs.map((config) => this.mapToDTO(config));
  }

  /**
   * Calculate pricing for given message type and guest count
   */
  async calculatePricing(request: CalculatePricingRequest): Promise<CalculatePricingResponse> {
    const { message_type, guest_count } = request;

    // Validate input
    if (guest_count < 1) {
      throw new Error("Guest count must be at least 1");
    }

    // Get pricing config
    const config = await pricingConfigRepository.getByMessageType(message_type);

    if (!config) {
      throw new Error(`Pricing configuration not found for message type: ${message_type}`);
    }

    // Calculate pricing using Decimal for precision
    const baseCost = new Decimal(config.baseCost || 0);
    const perGuestCost = new Decimal(config.perGuestCost || 0);
    const platformFeePercent = new Decimal(config.platformFeePercentage || 0);

    // Calculation formula: baseCost + (perGuestCost × guestCount) + platformFee
    const perGuestTotal = perGuestCost.times(guest_count);
    const subtotal = baseCost.plus(perGuestTotal);
    const platformFee = subtotal.times(platformFeePercent).dividedBy(100);
    const total = subtotal.plus(platformFee);

    return {
      message_type,
      guest_count,
      base_cost: parseFloat(baseCost.toFixed(2)),
      per_guest_cost: parseFloat(perGuestCost.toFixed(2)),
      per_guest_total: parseFloat(perGuestTotal.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      platform_fee_percentage: parseFloat(platformFeePercent.toFixed(2)),
      platform_fee: parseFloat(platformFee.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }

  /**
   * Map database model to DTO
   */
  private mapToDTO(config: any): PricingConfigDTO {
    return {
      id: config.id,
      messageType: config.messageType,
      displayName: config.displayName,
      description: config.description,
      baseCostPaise: config.baseCostPaise,
      profitPercent: config.profitPercent,
      baseCost: config.baseCost,
      perGuestCost: config.perGuestCost,
      platformFeePercentage: config.platformFeePercentage,
      includesImageGeneration: config.includesImageGeneration,
      includesPrioritySupport: config.includesPrioritySupport,
      includesAnalytics: config.includesAnalytics,
      isActive: config.isActive,
      isFeatured: config.isFeatured,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}

export const pricingConfigService = new PricingConfigService();