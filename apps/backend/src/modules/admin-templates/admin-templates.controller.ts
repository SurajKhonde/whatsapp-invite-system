import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { templates } from "@/db/schema/template.schema";
import { logger } from "@core/logger/logger";

// Fields to EXCLUDE when exporting — these are per-environment / per-row state
const EXCLUDED_FIELDS = [ "createdAt", "updatedAt", "processingStatus"];

function cleanTemplate(row: any) {
  const cleaned = { ...row };
  EXCLUDED_FIELDS.forEach((f) => delete cleaned[f]);
  return cleaned;
}

export class AdminTemplatesController {
  // GET /api/admin-templates/export/:templateId
  async exportTemplate(req: Request, res: Response) {
    const templateId = req.params.templateId as string;

    const [row] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId));

    if (!row) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.json({
      message: "Template exported",
      data: cleanTemplate(row),
      notify: false,
    });
  }

  // GET /api/admin-templates/export
  async exportAllTemplates(_req: Request, res: Response) {
    const rows = await db.select().from(templates);
    return res.json({
      message: `Exported ${rows.length} templates`,
      data: rows.map(cleanTemplate),
      notify: false,
    });
  }

  // POST /api/admin-templates/import
async importTemplate(req: Request, res: Response) {
  const payload = req.body;

  if (!payload?.title) {
    return res.status(400).json({ message: "title is required" });
  }

  // Strip id and timestamps — let prod DB generate fresh ones
  const { id, createdAt, updatedAt, ...insertable } = payload;

  const existing = await db
    .select()
    .from(templates)
    .where(eq(templates.title, payload.title));

  if (existing.length > 0) {
    return res.status(409).json({
      message: "Template with this title already exists",
      existingId: existing[0].id,
    });
  }

  const [inserted] = await db
    .insert(templates)
    .values({
      ...insertable,
      processingStatus: "completed",
    })
    .returning();

  logger.info({ templateId: inserted.id, title: inserted.title }, "📥 Template imported");

  return res.status(201).json({
    message: "Template imported successfully",
    data: { id: inserted.id, title: inserted.title },
    notify: true,
  });
}
}

export const adminTemplatesController = new AdminTemplatesController();