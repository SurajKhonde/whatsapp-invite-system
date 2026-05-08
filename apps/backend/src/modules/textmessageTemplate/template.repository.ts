import { db } from "@/db/index";
import { templates } from "@/db/schema/template.schema";
import { eq, and, sql } from "drizzle-orm";

export class TemplateRepository {
  // Get text templates with pagination
  async getTextTemplates(category: string | null, page: number = 1, limit: number = 12) {
    const offset = (page - 1) * limit;
    
    let query = db.select({
      id: templates.id,
      title: templates.title,
      category: templates.category,
      description: templates.description,
      textContent: templates.textContent,
    }).from(templates);

    if (category && category !== "all") {
      query = query.where(
        and(
          eq(templates.category, category),
          eq(templates.isActive, true)
        )
      ) as any;
    } else {
      query = query.where(eq(templates.isActive, true)) as any;
    }

    const data = await query.limit(limit).offset(offset);

    // Get total count using count function
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(templates);
    if (category && category !== "all") {
      countQuery = countQuery.where(
        and(
          eq(templates.category, category),
          eq(templates.isActive, true)
        )
      ) as any;
    } else {
      countQuery = countQuery.where(eq(templates.isActive, true)) as any;
    }
    
    const [{ count }] = await countQuery;

    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Get image templates with pagination
  async getImageTemplates(category: string | null, page: number = 1, limit: number = 12) {
    const offset = (page - 1) * limit;

    let query = db.select({
      id: templates.id,
      title: templates.title,
      category: templates.category,
      previewImageUrl: templates.previewImageUrl,
    }).from(templates);

    if (category && category !== "all") {
      query = query.where(
        and(
          eq(templates.category, category),
          eq(templates.isActive, true)
        )
      ) as any;
    } else {
      query = query.where(eq(templates.isActive, true)) as any;
    }

    const data = await query.limit(limit).offset(offset);

    // Get total count using count function
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(templates);
    if (category && category !== "all") {
      countQuery = countQuery.where(
        and(
          eq(templates.category, category),
          eq(templates.isActive, true)
        )
      ) as any;
    } else {
      countQuery = countQuery.where(eq(templates.isActive, true)) as any;
    }

    const [{ count }] = await countQuery;

    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id));
    return result[0] || null;
  }

  async getCategories() {
    const result = await db.select().from(templates).where(eq(templates.isActive, true));
    
    const categories = new Map<string, number>();
    result.forEach(t => {
      categories.set(t.category, (categories.get(t.category) || 0) + 1);
    });

    return Array.from(categories).map(([name, count]) => ({
      name,
      label: name.charAt(0).toUpperCase() + name.slice(1),
      count
    }));
  }

  async create(data: any) {
    return db.insert(templates).values(data).returning();
  }

  async delete(id: string) {
    return db.delete(templates).where(eq(templates.id, id));
  }
}