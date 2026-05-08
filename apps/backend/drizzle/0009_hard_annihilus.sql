ALTER TABLE "whatsapp_templates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "whatsapp_templates" CASCADE;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "language" varchar(10) DEFAULT 'en';--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "preview_image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "has_image" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "image_position" varchar(50);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "html_template_name" varchar(255);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "text_content" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "placeholders" jsonb;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "template_name" varchar(255);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "display_name" varchar(255);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "template_body" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "header_text" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "footer_text" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "parameters" jsonb;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "example" jsonb;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_status" varchar(50) DEFAULT 'PENDING_DELETION';--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "idx_templates_template_name" ON "templates" USING btree ("template_name");--> statement-breakpoint
CREATE INDEX "idx_templates_whatsapp_status" ON "templates" USING btree ("whatsapp_status");--> statement-breakpoint
CREATE INDEX "idx_templates_is_featured" ON "templates" USING btree ("is_featured");--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_template_name_unique" UNIQUE("template_name");