import { Request, Response } from "express";
import { TemplateService } from "./template.service";

const service = new TemplateService();

export class TemplateController {
  async getAll(req: Request, res: Response) {
    const { category } = req.query;

    const data = await service.getTemplates(category as string);
    res.json({ data });
  }

  async create(req: Request, res: Response) {
    const template = await service.createTemplate(req.body);
    res.json({ data: template });
  }

async delete(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    await service.deleteTemplate(id);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete template" });
  }
}
}
