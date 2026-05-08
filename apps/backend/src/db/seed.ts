import { db } from "./index";
import { templates } from "./schema/template.schema";
import { eq } from "drizzle-orm";

const SEED_DATA = [
  // ========== WEDDING TEMPLATES ==========
  {
    title: "Classic Wedding",
    category: "wedding",
    description: "Elegant classic wedding invitation with gold accents",
    language: "en",
    
    // Showcase fields
    htmlTemplateName: "wedding-classic",
    previewImageUrl: "https://res.cloudinary.com/inviteflow/image/upload/v1234567890/templates/wedding/classic-preview.jpg",
    textContent: "You are cordially invited to witness the marriage celebration of our beloved. Join us as we exchange vows and celebrate our love with family and friends. Your presence means the world to us.",
    placeholders: {
      name: "Guest Name",
      date: "May 15, 2024",
      time: "6:00 PM",
      venue: "Grand Hotel, New York",
    },
    
    // WhatsApp fields
    templateName: "wedding_classic_en",
    displayName: "Classic Wedding",
    templateBody: "You are cordially invited to witness the marriage celebration. {{1}} - {{2}}. {{3}}. {{4}}.",
    headerText: "Wedding Invitation",
    footerText: "Made with ❤️ using InviteFlow",
    hasImage: false,
    parameters: [
      { index: 1, key: "name", label: "Guest Name" },
      { index: 2, key: "date", label: "Event Date" },
      { index: 3, key: "time", label: "Event Time" },
      { index: 4, key: "venue", label: "Venue" },
    ],
    example: {
      name: "John Doe",
      date: "May 15, 2024",
      time: "6:00 PM",
      venue: "Grand Hotel, New York"
    },
    whatsappTemplateName: "wedding_classic_en",
    whatsappCategory: "MARKETING",
    whatsappLanguageCode: "en",
    whatsappParameters: [
      { index: 1, type: "text" },
      { index: 2, type: "text" },
      { index: 3, type: "text" },
      { index: 4, type: "text" },
    ],
    whatsappStatus: "APPROVED",
    isActive: true,
    isFeatured: true,
  },
  
  {
    title: "Premium Wedding",
    category: "wedding",
    description: "Luxury premium wedding invitation with premium design",
    language: "en",
    
    // Showcase fields
    htmlTemplateName: "wedding-premium",
    previewImageUrl: "https://res.cloudinary.com/inviteflow/image/upload/v1234567890/templates/wedding/premium-preview.jpg",
    textContent: "Together with our families, we request the honor of your presence at the marriage of our beloved. Join us for a celebration of love and commitment.",
    placeholders: {
      name: "Guest Name",
      date: "June 1, 2024",
      time: "7:00 PM",
      venue: "The Palace Ballroom, Mumbai",
    },
    
    // WhatsApp fields
    templateName: "wedding_premium_en",
    displayName: "Premium Wedding",
    templateBody: "Together with our families, we request the honor of your presence. {{1}} - {{2}}. {{3}}. {{4}}.",
    headerText: "Wedding Celebration",
    footerText: "Made with ❤️ using InviteFlow",
    hasImage: true,
    imagePosition: "header",
    parameters: [
      { index: 1, key: "name", label: "Guest Name" },
      { index: 2, key: "date", label: "Event Date" },
      { index: 3, key: "time", label: "Event Time" },
      { index: 4, key: "venue", label: "Venue" },
    ],
    example: {
      name: "Jane Doe",
      date: "June 1, 2024",
      time: "7:00 PM",
      venue: "The Palace Ballroom, Mumbai"
    },
    whatsappTemplateName: "wedding_premium_en",
    whatsappCategory: "MARKETING",
    whatsappLanguageCode: "en",
    whatsappParameters: [
      { index: 1, type: "text" },
      { index: 2, type: "text" },
      { index: 3, type: "text" },
      { index: 4, type: "text" },
    ],
    whatsappStatus: "APPROVED",
    isActive: true,
    isFeatured: true,
  },
  
  // ========== BIRTHDAY TEMPLATES ==========
  {
    title: "Happy Birthday",
    category: "birthday",
    description: "Fun and colorful birthday celebration invitation",
    language: "en",
    
    // Showcase fields
    htmlTemplateName: "birthday-premium",
    previewImageUrl: "https://res.cloudinary.com/inviteflow/image/upload/v1234567890/templates/birthday/premium-preview.jpg",
    textContent: "You're invited to celebrate the special day! Join us for cake, fun, and wonderful memories with family and friends.",
    placeholders: {
      name: "Guest Name",
      date: "July 20, 2024",
      time: "5:00 PM",
      venue: "Party Hall Downtown",
    },
    
    // WhatsApp fields
    templateName: "birthday_celebration_en",
    displayName: "Happy Birthday",
    templateBody: "You're invited to celebrate! {{1}} - {{2}}. {{3}}. {{4}}. Join us for cake and fun!",
    headerText: "Birthday Celebration",
    footerText: "Made with ❤️ using InviteFlow",
    hasImage: true,
    imagePosition: "header",
    parameters: [
      { index: 1, key: "name", label: "Guest Name" },
      { index: 2, key: "date", label: "Event Date" },
      { index: 3, key: "time", label: "Event Time" },
      { index: 4, key: "venue", label: "Venue" },
    ],
    example: {
      name: "Alex Smith",
      date: "July 20, 2024",
      time: "5:00 PM",
      venue: "Party Hall Downtown"
    },
    whatsappTemplateName: "birthday_celebration_en",
    whatsappCategory: "MARKETING",
    whatsappLanguageCode: "en",
    whatsappParameters: [
      { index: 1, type: "text" },
      { index: 2, type: "text" },
      { index: 3, type: "text" },
      { index: 4, type: "text" },
    ],
    whatsappStatus: "APPROVED",
    isActive: true,
    isFeatured: false,
  },
];

async function seedTemplates() {
  try {
    console.log("🌱 Seeding universal templates...");

    for (const template of SEED_DATA) {
      // Check if template already exists
      const existing = await db
        .select()
        .from(templates)
        .where(eq(templates.title, template.title));

      if (existing.length === 0) {
        await db.insert(templates).values({
          ...template,
        });
        console.log(`✅ Added: ${template.title}`);
      } else {
        console.log(`⏭️  Skipped: ${template.title} (already exists)`);
      }
    }

    console.log("✨ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedTemplates();