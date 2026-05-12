import { Request, Response } from "express";
import { pricingConfigService } from "./pricingConfig.service";
import { CalculatePricingRequest, MessageType, PricingConfigResponse, AllPricingConfigResponse } from "./Pricingconfig.types";
import { ApiErrorResponse } from "./Pricingconfig.types";

export class PricingConfigController {
 
  async getPricingConfigByType(req: Request, res: Response): Promise<void> {
    try {
      const messageType = req.params.messageType;

      // Validate messageType is a string
      if (typeof messageType !== "string") {
        res.status(400).json({
          success: false,
          error: "Invalid parameter",
          message: "messageType must be a string",
          statusCode: 400,
        } as ApiErrorResponse);
        return;
      }

      // Validate message type value
      if (!["text_only", "image_only", "image_and_text"].includes(messageType)) {
        res.status(400).json({
          success: false,
          error: "Invalid message type",
          message: `Message type must be one of: text_only, image_only, image_and_text. Got: ${messageType}`,
          statusCode: 400,
        } as ApiErrorResponse);
        return;
      }

      const pricingConfig = await pricingConfigService.getPricingConfigByType(messageType as MessageType);

      res.status(200).json({
        success: true,
        data: pricingConfig,
      } as PricingConfigResponse);
    } catch (error: any) {
      console.error("Error in getPricingConfigByType:", error);

      res.status(404).json({
        success: false,
        error: "Not Found",
        message: error.message || "Pricing configuration not found",
        statusCode: 404,
      } as ApiErrorResponse);
    }
  }

  /**
   * GET /api/pricing-config
   * Get all active pricing configs
   */
  async getAllPricingConfigs(req: Request, res: Response): Promise<void> {
    try {
      const pricingConfigs = await pricingConfigService.getAllActivePricingConfigs();

      res.status(200).json({
        success: true,
        data: pricingConfigs,
      } as AllPricingConfigResponse);
    } catch (error: any) {
      console.error("Error in getAllPricingConfigs:", error);

      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to fetch pricing configurations",
        statusCode: 500,
      } as ApiErrorResponse);
    }
  }

  /**
   * GET /api/pricing-config/featured
   * Get featured pricing configs
   */
  async getFeaturedPricingConfigs(req: Request, res: Response): Promise<void> {
    try {
      const pricingConfigs = await pricingConfigService.getFeaturedPricingConfigs();

      res.status(200).json({
        success: true,
        data: pricingConfigs,
      } as AllPricingConfigResponse);
    } catch (error: any) {
      console.error("Error in getFeaturedPricingConfigs:", error);

      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to fetch featured pricing configurations",
        statusCode: 500,
      } as ApiErrorResponse);
    }
  }

  /**
   * POST /api/pricing-config/calculate
   * Calculate pricing for given message type and guest count
   */
  async calculatePricing(req: Request, res: Response): Promise<void> {
    try {
      const { message_type, guest_count } = req.body as CalculatePricingRequest;

      // Validate required fields
      if (!message_type) {
        res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "message_type is required",
          statusCode: 400,
        } as ApiErrorResponse);
        return;
      }

      if (guest_count === undefined || guest_count === null) {
        res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "guest_count is required",
          statusCode: 400,
        } as ApiErrorResponse);
        return;
      }

      // Validate message type is string
      if (typeof message_type !== "string") {
        res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "message_type must be a string",
          statusCode: 400,
        } as ApiErrorResponse);
        return;
      }

      // Validate message type value
      if (!["text_only", "image_only", "image_and_text"].includes(message_type)) {
        res.status(400).json({
          success: false,
          error: "Invalid message type",
          message: `Message type must be one of: text_only, image_only, image_and_text. Got: ${message_type}`,
          statusCode: 400,
        } as ApiErrorResponse);
        return;
      }

      // Validate guest count
      if (typeof guest_count !== "number" || guest_count < 1) {
        res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "guest_count must be a number greater than 0",
          statusCode: 400,
        } as ApiErrorResponse);
        return;
      }

      const calculatedPricing = await pricingConfigService.calculatePricing({
        message_type: message_type as MessageType,
        guest_count,
      });

      res.status(200).json({
        success: true,
        data: calculatedPricing,
      });
    } catch (error: any) {
      console.error("Error in calculatePricing:", error);

      res.status(400).json({
        success: false,
        error: "Bad Request",
        message: error.message || "Failed to calculate pricing",
        statusCode: 400,
      } as ApiErrorResponse);
    }
  }
}

export const pricingConfigController = new PricingConfigController();