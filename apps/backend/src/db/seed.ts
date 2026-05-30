import { db } from "./index";
import { templates } from "./schema/template.schema";
import { pricingConfig } from "./schema/pricing.schema";
import { eq } from "drizzle-orm";

const PRICING_DATA = [
  {
    messageType: "text_only",
    displayName: "Text Only",
    description: "Text-based invitations sent via WhatsApp",
    baseCostPaise: "100",
    profitPercent: "20",
    baseCost: "1.00",
    perGuestCost: "1.00",
    platformFeePercentage: "5",
    includesImageGeneration: false,
    includesPrioritySupport: false,
    includesAnalytics: false,
    isActive: true,
  },
  {
    messageType: "image_only",
    displayName: "Image Only",
    description: "Image-based invitations sent via WhatsApp",
    baseCostPaise: "200",
    profitPercent: "25",
    baseCost: "2.00",
    perGuestCost: "2.00",
    platformFeePercentage: "5",
    includesImageGeneration: true,
    includesPrioritySupport: false,
    includesAnalytics: false,
    isActive: true,
  },
  {
    messageType: "image_and_text",
    displayName: "Image + Text",
    description: "Image and text invitations sent via WhatsApp",
    baseCostPaise: "250",
    profitPercent: "30",
    baseCost: "2.50",
    perGuestCost: "2.50",
    platformFeePercentage: "5",
    includesImageGeneration: true,
    includesPrioritySupport: true,
    includesAnalytics: true,
    isActive: true,
  },
];

// async function seedTemplates() {
//   console.log("🌱 Seeding universal templates...");

//   for (const template of SEED_DATA) {
//     const existing = await db
//       .select()
//       .from(templates)
//       .where(eq(templates.title, template.title));

//     if (existing.length === 0) {
//       await db.insert(templates).values({ ...template });
//       console.log(`✅ Added: ${template.title}`);
//     } else {
//       console.log(`⏭️  Skipped: ${template.title} (already exists)`);
//     }
//   }
// }

async function seedPricing() {
  console.log("🌱 Seeding pricing configs...");

  for (const config of PRICING_DATA) {
    const existing = await db
      .select()
      .from(pricingConfig)
      .where(eq(pricingConfig.messageType, config.messageType));

    if (existing.length === 0) {
      await db.insert(pricingConfig).values(config);
      console.log(`✅ Added pricing: ${config.messageType}`);
    } else {
      console.log(`⏭️  Skipped pricing: ${config.messageType} (already exists)`);
    }
  }
}

async function main() {
  try {
    // await seedTemplates();
    await seedPricing();
    console.log("✨ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();