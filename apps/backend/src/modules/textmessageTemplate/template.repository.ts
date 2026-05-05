import { db } from "@/db/index";
import { templates } from "@/db/schema/template.schema";
import { eq } from "drizzle-orm";

export class TemplateRepository {
  async findAll() {
    return db.select().from(templates);
  }

  async findByCategory(category: string) {
    return db
      .select()
      .from(templates)
      .where(eq(templates.category, category));
  }

  async create(data: any) {
    return db.insert(templates).values(data).returning();
  }

  async delete(id: string) {
    return db.delete(templates).where(eq(templates.id, id));
  }
}