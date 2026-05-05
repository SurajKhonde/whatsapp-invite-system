export const calculatePrice = (
  baseCostPaise: number,
  profitPercent: number,
  guestCount: number
) => {
  const pricePerMessage = baseCostPaise * (1 + profitPercent / 100);
  const total = Math.ceil(pricePerMessage * guestCount); // ceil so no fraction paise

  return {
    pricePerMessagePaise: Math.ceil(pricePerMessage),
    totalAmountPaise: total,
    totalAmountRupees: (total / 100).toFixed(2),
  };
};

// Example:
// baseCost = 30 paise (₹0.30 whatsapp text)
// profitPercent = 30%
// pricePerMessage = 30 * 1.30 = 39 paise (₹0.39)
// guestCount = 500
// total = 39 * 500 = 19500 paise = ₹195


// await db.insert(pricingConfig).values([
//   {
//     messageType:   "whatsapp_text",
//     baseCostPaise: "30",    // ₹0.30 per message
//     profitPercent: "30",    // you earn 30% = ₹0.09 per message
//     note:          "Meta standard text message rate",
//   },
//   {
//     messageType:   "whatsapp_image",
//     baseCostPaise: "58",    // ₹0.58 (text + image surcharge)
//     profitPercent: "30",    // you earn 30% = ₹0.17 per message
//     note:          "Meta image message rate",
//   },
// ]);