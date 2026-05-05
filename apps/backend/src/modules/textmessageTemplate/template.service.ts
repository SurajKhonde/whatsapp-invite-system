import { TemplateRepository } from "./template.repository";

const repo = new TemplateRepository();

export class TemplateService {
  getTemplates(category?: string) {
    if (category) return repo.findByCategory(category);
    return repo.findAll();
  }

  createTemplate(data: any) {
    return repo.create(data);
  }

  deleteTemplate(id: string) {
    return repo.delete(id);
  }
}