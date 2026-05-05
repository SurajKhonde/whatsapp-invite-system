CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"order_id" text NOT NULL,
	"payment_id" text,
	"signature" text,
	"message_type" text NOT NULL,
	"guest_count" integer NOT NULL,
	"base_cost_paise" numeric(10, 2) NOT NULL,
	"profit_percent" numeric(5, 2) NOT NULL,
	"price_per_message_paise" numeric(10, 2) NOT NULL,
	"total_amount_paise" integer NOT NULL,
	"currency" text DEFAULT 'INR',
	"status" text DEFAULT 'created',
	"error_code" text,
	"error_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "pricing_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_type" text NOT NULL,
	"base_cost_paise" numeric(10, 2) NOT NULL,
	"profit_percent" numeric(5, 2) DEFAULT '30' NOT NULL,
	"is_active" boolean DEFAULT true,
	"note" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pricing_config_message_type_unique" UNIQUE("message_type")
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;