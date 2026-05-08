// import { TemplateRepository } from "./template.repository";

// const repo = new TemplateRepository();

// export class TemplateService {
//   getTemplates(category?: string) {
//     if (category) return repo.findByCategory(category);
//     return repo.findAll();
//   }

//   createTemplate(data: any) {
//     return repo.create(data);
//   }

//   deleteTemplate(id: string) {
//     return repo.delete(id);
//   }
// }


import { TemplateRepository } from "./template.repository";
import * as fs from "fs/promises";
import * as path from "path";

const repo = new TemplateRepository();

export class TemplateService {
  // Get text templates with pagination
  async getTextTemplates(category: string | null, page: number = 1, limit: number = 12) {
    return repo.getTextTemplates(category, page, limit);
  }

  // Get image templates with pagination
  async getImageTemplates(category: string | null, page: number = 1, limit: number = 12) {
    return repo.getImageTemplates(category, page, limit);
  }

  async getTemplateById(id: string) {
    return repo.findById(id);
  }

  async getCategories() {
    return repo.getCategories();
  }

  async getTemplateHtml(htmlTemplateName: string, category: string) {
    try {
      const filePath = path.join(
        process.cwd(),
        "src/HTML-template",
        category,
        `${htmlTemplateName}.html`
      );
      const html = await fs.readFile(filePath, "utf-8");
      return html;
    } catch (error) {
      throw new Error(`Template HTML file not found: ${htmlTemplateName}`);
    }
  }

  async createTemplate(data: any) {
    return repo.create(data);
  }

  async deleteTemplate(id: string) {
    return repo.delete(id);
  }
}