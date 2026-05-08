CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid,
	"order_id" varchar(255) NOT NULL,
	"razorpay_order_id" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'INR',
	"payment_id" varchar(255),
	"razorpay_payment_id" varchar(255),
	"signature" varchar(512),
	"razorpay_signature" varchar(512),
	"message_type" varchar(50),
	"guest_count" integer,
	"base_cost_paise" numeric(15, 0),
	"price_per_message_paise" numeric(15, 0),
	"total_amount_paise" numeric(15, 0),
	"base_cost" numeric(10, 2),
	"per_guest_cost" numeric(10, 2),
	"total_guests" varchar(10),
	"platform_fee" numeric(10, 2),
	"profit_percent" numeric(5, 2),
	"status" varchar(50) DEFAULT 'created',
	"error_code" varchar(100),
	"error_description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_order_id_unique" UNIQUE("order_id"),
	CONSTRAINT "payments_razorpay_order_id_unique" UNIQUE("razorpay_order_id")
);
--> statement-breakpoint
CREATE TABLE "pricing_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_type" varchar(50) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"description" varchar(500),
	"base_cost_paise" numeric(15, 0) NOT NULL,
	"profit_percent" numeric(5, 2) NOT NULL,
	"base_cost" numeric(10, 2),
	"per_guest_cost" numeric(10, 2),
	"platform_fee_percentage" numeric(5, 2),
	"includes_image_generation" boolean DEFAULT false,
	"includes_priority_support" boolean DEFAULT false,
	"includes_analytics" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pricing_config_message_type_unique" UNIQUE("message_type")
);
--> statement-breakpoint
DROP TABLE "payment_orders" CASCADE;--> statement-breakpoint
DROP TABLE "pricing" CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_payments_user_id" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payments_event_id" ON "payments" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_payments_status" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payments_razorpay_order_id" ON "payments" USING btree ("razorpay_order_id");--> statement-breakpoint
CREATE INDEX "idx_payments_razorpay_payment_id" ON "payments" USING btree ("razorpay_payment_id");--> statement-breakpoint
CREATE INDEX "idx_payments_created_at" ON "payments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_pricing_config_message_type" ON "pricing_config" USING btree ("message_type");--> statement-breakpoint
CREATE INDEX "idx_pricing_config_is_active" ON "pricing_config" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_pricing_config_created_at" ON "pricing_config" USING btree ("created_at");