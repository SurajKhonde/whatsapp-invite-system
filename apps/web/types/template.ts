 interface Template {
  id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  createdAt?: string;
}
export type TemplateResponse = {
  data: Template[];
  success: boolean;
};
