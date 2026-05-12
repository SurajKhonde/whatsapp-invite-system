

import { db } from "@/db/index";
import { pricingConfig } from "@/db/schema/pricing.schema";
import { eq } from "drizzle-orm";
import { 
  PricingConfig, 
  PricingConfigInsert, 
  MessageType 
} from "./Pricingconfig.types";

export class PricingConfigRepository {
  /**
   * Get pricing config by message type
   */
  async getByMessageType(messageType: MessageType): Promise<PricingConfig | null> {
    try {
      const result = await db
        .select()
        .from(pricingConfig)
        .where(eq(pricingConfig.messageType, messageType))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error fetching pricing config by message type:", error);
      throw error;
    }
  }

  /**
   * Get all active pricing configs
   */
  async getAllActive(): Promise<PricingConfig[]> {
    try {
      return await db
        .select()
        .from(pricingConfig)
        .where(eq(pricingConfig.isActive, true));
    } catch (error) {
      console.error("Error fetching active pricing configs:", error);
      throw error;
    }
  }

  /**
   * Get all pricing configs (including inactive)
   */
  async getAll(): Promise<PricingConfig[]> {
    try {
      return await db.select().from(pricingConfig);
    } catch (error) {
      console.error("Error fetching all pricing configs:", error);
      throw error;
    }
  }

  /**
   * Get featured pricing configs
   */
  async getFeatured(): Promise<PricingConfig[]> {
    try {
      return await db
        .select()
        .from(pricingConfig)
        .where(eq(pricingConfig.isFeatured, true));
    } catch (error) {
      console.error("Error fetching featured pricing configs:", error);
      throw error;
    }
  }

  /**
   * Create pricing config
   */
  async create(data: PricingConfigInsert): Promise<PricingConfig> {
    try {
      const result = await db.insert(pricingConfig).values(data).returning();
      
      if (!result || result.length === 0) {
        throw new Error("Failed to create pricing config");
      }
      
      return result[0];
    } catch (error) {
      console.error("Error creating pricing config:", error);
      throw error;
    }
  }

  /**
   * Update pricing config
   */
  async update(messageType: MessageType, data: Partial<PricingConfigInsert>): Promise<PricingConfig> {
    try {
      const result = await db
        .update(pricingConfig)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(pricingConfig.messageType, messageType))
        .returning();

      if (!result || result.length === 0) {
        throw new Error(`Pricing config with message type ${messageType} not found`);
      }

      return result[0];
    } catch (error) {
      console.error("Error updating pricing config:", error);
      throw error;
    }
  }

  /**
   * Delete pricing config
   */
  async delete(messageType: MessageType): Promise<boolean> {
    try {
      const result = await db
        .delete(pricingConfig)
        .where(eq(pricingConfig.messageType, messageType));

      // Drizzle returns the deleted rows, check if array is not empty
      return Array.isArray(result) && result.length > 0;
    } catch (error) {
      console.error("Error deleting pricing config:", error);
      throw error;
    }
  }

  /**
   * Check if pricing config exists
   */
  async exists(messageType: MessageType): Promise<boolean> {
    try {
      const result = await db
        .select()
        .from(pricingConfig)
        .where(eq(pricingConfig.messageType, messageType))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      console.error("Error checking if pricing config exists:", error);
      throw error;
    }
  }
}

export const pricingConfigRepository = new PricingConfigRepository();