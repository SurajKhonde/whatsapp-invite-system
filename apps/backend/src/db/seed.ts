import { db } from "@/db/index";
import { pricingConfig } from "@/db/schema/pricing.schema";

async function seed() {
  console.log("🌱 Seeding pricing...");

  await db.insert(pricingConfig).values([
    {
      messageType: "whatsapp_text",
      baseCostPaise: "30",      // store as string (your schema)
      profitPercent: "30",
      isActive: true,
      note: "Meta standard text message rate",
    },
    {
      messageType: "whatsapp_image",
      baseCostPaise: "58",
      profitPercent: "30",
      isActive: true,
      note: "Meta image message rate",
    },
  ]);

  console.log("✅ Pricing seeded successfully");
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});