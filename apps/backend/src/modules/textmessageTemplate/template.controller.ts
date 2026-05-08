import { Request, Response } from "express";
import { TemplateService } from "./template.service";

const service = new TemplateService();

export class TemplateController {
  // Get text templates
  async getText(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;

      const result = await service.getTextTemplates(category as string || null, page, limit);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get image templates
  async getImages(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;

      const result = await service.getImageTemplates(category as string || null, page, limit);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get single template (for event creation)
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Ensure id is string, not string[]
      const templateId = Array.isArray(id) ? id[0] : id;
      
      const template = await service.getTemplateById(templateId);

      if (!template) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }

      // Get the HTML template file if needed
      let htmlTemplate = null;
      if (template.htmlTemplateName) {
        htmlTemplate = await service.getTemplateHtml(
          template.htmlTemplateName,
          template.category
        );
      }

      res.json({
        success: true,
        data: {
          ...template,
          htmlTemplate,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get categories
  async getCategories(req: Request, res: Response) {
    try {
      const data = await service.getCategories();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const template = await service.createTemplate(req.body);
      res.json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Ensure id is string, not string[]
      const templateId = Array.isArray(id) ? id[0] : id;
      
      await service.deleteTemplate(templateId);
      return res.json({ success: true, message: "Template deleted" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}