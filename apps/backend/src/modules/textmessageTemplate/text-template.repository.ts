import { db } from "@/db/index";

import { templates }
from "@/db/schema/template.schema";

import {
  eq,
  and,
} from "drizzle-orm";

export class TextTemplateRepository {
  /**
   * ============================================
   * CREATE TEMPLATE
   * ============================================
   */
  async createTemplate(
    data: any
  ) {
    const result =
      await db
        .insert(templates)
        .values(data)
        .returning();

    return result[0];
  }

  /**
   * ============================================
   * GET ALL TEXT TEMPLATES
   * ============================================
   */
  async getAllTemplates() {
    return db
      .select()
      .from(templates)
      .where(
        eq(
          templates.type,
          "text"
        )
      );
  }

  /**
   * ============================================
   * GET TEXT TEMPLATES
   * ============================================
   */
  async getTextTemplates() {
    return db
      .select()
      .from(templates)
      .where(
        eq(
          templates.type,
          "text"
        )
      );
  }

  /**
   * ============================================
   * GET IMAGE TEMPLATES
   * ============================================
   */
  async getImageTemplates() {
    return db
      .select()
      .from(templates)
      .where(
        eq(
          templates.type,
          "image"
        )
      );
  }

  /**
   * ============================================
   * GET CATEGORIES
   * ============================================
   */
  async getCategories() {
    const result =
      await db
        .select()
        .from(templates);

    return [
      ...new Set(
        result.map(
          (t: any) =>
            t.category
        )
      ),
    ];
  }

  /**
   * ============================================
   * GET BY CATEGORY
   * ============================================
   */
  async getTemplatesByCategory(
    category: string
  ) {
    return db
      .select()
      .from(templates)
      .where(
        and(
          eq(
            templates.type,
            "text"
          ),

          eq(
            templates.category,
            category
          )
        )
      );
  }

  /**
   * ============================================
   * GET IMAGE TEMPLATES BY CATEGORY
   * ============================================
   */
  async getImageTemplatesByCategory(
    category: string
  ) {
    return db
      .select()
      .from(templates)
      .where(
        and(
          eq(
            templates.type,
            "image"
          ),

          eq(
            templates.category,
            category
          )
        )
      );
  }

  /**
   * ============================================
   * GET TEMPLATE BY ID
   * ============================================
   */
  async getTemplateById(
    id: string
  ) {
    const result =
      await db
        .select()
        .from(templates)
        .where(
          eq(
            templates.id,
            id
          )
        );

    return result[0] || null;
  }

  /**
   * ============================================
   * DELETE TEMPLATE
   * ============================================
   */
  async deleteTemplate(
    id: string
  ) {
    return db
      .delete(templates)
      .where(
        eq(
          templates.id,
          id
        )
      );
  }

   validateParameters(
    template: any,

    params: Record<
      string,
      string
    >
  ) {
    const placeholders =
      template.placeholders || [];

    const missingFields:
      string[] = [];

    for (const field of placeholders) {
      const key =
        field.key;

      if (
        !params[key] ||
        params[key]
          .toString()
          .trim() === ""
      ) {
        missingFields.push(
          key
        );
      }
    }

    return {
      valid:
        missingFields.length === 0,

      missingFields,
    };
  }
}

export const textTemplateRepository =
  new TextTemplateRepository();