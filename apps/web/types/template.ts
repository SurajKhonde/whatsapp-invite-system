interface Template {
  id: string;
  title: string;
  description?: string;
  category: string;
  textContent?: string;
  previewImageUrl?: string;
  htmlTemplateName?: string;
  placeholders?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

interface TemplateCategory {
  name: string;
  label: string;
  count: number;
}

interface TemplatePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TextTemplatesResponse {
  success: boolean;
  data: Template[];
  pagination: TemplatePagination;
}

interface ImageTemplatesResponse {
  success: boolean;
  data: Template[];
  pagination: TemplatePagination;
}

interface TemplateDetailResponse {
  success: boolean;
  data: Template & {
    htmlTemplate?: string;
    templateBody?: string;
    parameters?: Array<{index: number; key: string; label: string}>;
  };
}

interface TemplateCategoriesResponse {
  success: boolean;
  data: TemplateCategory[];
}

export type TemplateResponse = {
  data: Template[];
  success: boolean;
};