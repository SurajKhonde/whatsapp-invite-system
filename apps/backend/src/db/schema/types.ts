import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { templates } from "./template.schema";

export type Template = InferSelectModel<typeof templates>;
export type NewTemplate = InferInsertModel<typeof templates>;