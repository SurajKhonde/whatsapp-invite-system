// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useCreateOrderMutation,
//   useVerifyPaymentMutation,
//   useCreateEventMutation,
//   useGetPricingConfigQuery,
// } from "@/store/apiSlice";

// import {
//   useCreateEvent,
// } from "@/hooks/useCreateEvent";

// import { useMessageType } from "@/hooks/usePricing";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface PricingBreakdown {
//   baseCost: number;
//   perGuestCost: number;
//   perGuestTotal: number;
//   subtotal: number;
//   platformFeePercentage: number;
//   platformFee: number;
//   total: number;
// }

// export default function Step4_ReviewAndPay() {
//   const {
//     selectedTemplate,
//     eventDetails,
//     selectedGuests,
//     goNext,
//     goPrev,
//     setError,
//     error,
//     setPaymentSuccess,
//     setEventCreated,
//   } = useCreateEvent();

//   const [createOrder] =
//     useCreateOrderMutation();

//   const [verifyPayment] =
//     useVerifyPaymentMutation();

//   const [createEvent] =
//     useCreateEventMutation();

//   const [loading, setLoading] =
//     useState(false);

//   const [
//     paymentStarted,
//     setPaymentStarted,
//   ] = useState(false);

//   // =====================================================
//   // DYNAMIC MESSAGE TYPE
//   // =====================================================
//   const messageType = useMessageType(selectedTemplate);

//   // =====================================================
//   // GET PRICING CONFIG
//   // =====================================================
//   const { data: pricingResponse, isLoading: pricingLoading } = useGetPricingConfigQuery(messageType);
//   const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown | null>(null);

//   // =====================================================
//   // CALCULATE PRICING
//   // =====================================================
//   useEffect(() => {
//     if (pricingResponse?.data && selectedGuests.length > 0) {
//       const pricingConfig = pricingResponse.data;
//       const baseCost = parseFloat(pricingConfig.baseCost || "0");
//       const perGuestCost = parseFloat(pricingConfig.perGuestCost || "0");
//       const platformFeePercent = parseFloat(pricingConfig.platformFeePercentage || "0");

//       const perGuestTotal = perGuestCost * selectedGuests.length;
//       const subtotal = baseCost + perGuestTotal;
//       const platformFee = (subtotal * platformFeePercent) / 100;
//       const total = subtotal + platformFee;

//       setPricingBreakdown({
//         baseCost,
//         perGuestCost,
//         perGuestTotal,
//         subtotal,
//         platformFeePercentage: platformFeePercent,
//         platformFee,
//         total,
//       });
//     }
//   }, [pricingResponse, selectedGuests.length]);

//   // =====================================================
//   // LOAD RAZORPAY
//   // =====================================================

//   useEffect(() => {
//     const script =
//       document.createElement(
//         "script"
//       );

//     script.src =
//       "https://checkout.razorpay.com/v1/checkout.js";

//     script.async = true;

//     document.body.appendChild(
//       script
//     );

//     return () => {
//       if (
//         document.body.contains(
//           script
//         )
//       ) {
//         document.body.removeChild(
//           script
//         );
//       }
//     };
//   }, []);

//   // =====================================================
//   // PAYMENT
//   // =====================================================

//   const handlePayment =
//     async () => {
//       if (
//         !selectedTemplate?.id
//       ) {
//         setError(
//           "Template not selected"
//         );

//         return;
//       }

//       if (!pricingBreakdown) {
//         setError(
//           "Unable to load pricing. Please refresh and try again."
//         );
//         return;
//       }

//       try {
//         setLoading(true);

//         setError(null);

//         // =========================================
//         // CREATE ORDER
//         // =========================================

//         const orderResponse =
//           await createOrder({
//             templateId:
//               selectedTemplate.id,

//             messageType,

//             guestCount:
//               selectedGuests.length,

//             amount: pricingBreakdown.total,
//           }).unwrap();

//         const {
//           orderId,
//           amount,
//         } = orderResponse.data;

//         setPaymentStarted(
//           true
//         );

//         // =========================================
//         // RAZORPAY
//         // =========================================

//         const options = {
//           key:
//             process.env
//               .NEXT_PUBLIC_RAZORPAY_KEY_ID,

//           amount:
//             amount,

//           currency:
//             "INR",

//           order_id:
//             orderId,

//           description: `${messageType} - ${selectedGuests.length} guests`,

//           handler:
//             async (
//               response: any
//             ) => {
//               try {
//                 // =================================
//                 // VERIFY PAYMENT
//                 // =================================

//                 await verifyPayment({
//                   razorpay_order_id:
//                     response.razorpay_order_id,

//                   razorpay_payment_id:
//                     response.razorpay_payment_id,

//                   razorpay_signature:
//                     response.razorpay_signature,
//                 }).unwrap();

//                 setPaymentSuccess(
//                   response.razorpay_payment_id
//                 );

//                 // =================================
//                 // CREATE EVENT
//                 // =================================

//                 const eventResponse =
//                   await createEvent(
//                     {
//                       templateId:
//                         selectedTemplate.id,

//                       messageType,

//                       eventDetails,

//                       guestIds:
//                         selectedGuests,

//                       paymentId:
//                         response.razorpay_payment_id,

//                       orderId:
//                         response.razorpay_order_id,
//                     }
//                   ).unwrap();

//                 setEventCreated(
//                   eventResponse
//                     .data.id
//                 );

//                 goNext();
//               } catch (
//                 error
//               ) {
//                 setError(
//                   "Payment verification failed"
//                 );

//                 setPaymentStarted(
//                   false
//                 );

//                 setLoading(
//                   false
//                 );
//               }
//             },

//           prefill: {
//             name:
//               String(Object.values(eventDetails || {})[0] || "Guest"),

//             email:
//               "user@example.com",
//           },

//           theme: {
//             color:
//               "#e91e8c",
//           },

//           modal: {
//             ondismiss:
//               () => {
//                 setPaymentStarted(
//                   false
//                 );

//                 setLoading(
//                   false
//                 );

//                 setError(
//                   "Payment cancelled"
//                 );
//               },
//           },
//         };

//         const razorpay =
//           new window.Razorpay(
//             options
//           );

//         razorpay.open();
//       } catch (err: any) {
//         setError(
//           err?.data
//             ?.message ||
//             "Failed to create order"
//         );

//         setPaymentStarted(
//           false
//         );

//         setLoading(false);
//       }
//     };

//   return (
//     <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
//       {/* HEADER */}
//       <div style={{ marginBottom: "32px" }}>
//         <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
//           Step 4 of 5: Review & Pay
//         </h2>
//         <p style={{ color: "#999", fontSize: "14px" }}>
//           Review your event and complete payment
//         </p>
//       </div>

//       {/* ERROR */}
//       {error && (
//         <div style={{
//           marginBottom: "24px",
//           padding: "16px",
//           background: "rgba(239, 68, 68, 0.1)",
//           border: "1px solid rgba(239, 68, 68, 0.3)",
//           borderRadius: "8px",
//           color: "#fca5a5",
//           fontSize: "14px",
//         }}>
//           ⚠️ {error}
//         </div>
//       )}

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
//         {/* LEFT - EVENT DETAILS */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
//           {/* TEMPLATE */}
//           <div style={{
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: "12px",
//             padding: "24px",
//           }}>
//             <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//               📋 Selected Template
//             </h3>
//             <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>
//               {selectedTemplate?.title || "—"}
//             </p>
//             <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//               {selectedTemplate?.category && (
//                 <span style={{
//                   display: "inline-block",
//                   padding: "6px 12px",
//                   background: "rgba(233, 30, 140, 0.2)",
//                   border: "1px solid rgba(233, 30, 140, 0.3)",
//                   borderRadius: "6px",
//                   fontSize: "12px",
//                   color: "#e91e8c",
//                   fontWeight: 600,
//                 }}>
//                   {selectedTemplate.category}
//                 </span>
//               )}
//               <span style={{
//                 display: "inline-block",
//                 padding: "6px 12px",
//                 background: messageType === "image_and_text"
//                   ? "rgba(59, 130, 246, 0.2)"
//                   : "rgba(156, 163, 175, 0.2)",
//                 border: messageType === "image_and_text"
//                   ? "1px solid rgba(59, 130, 246, 0.3)"
//                   : "1px solid rgba(156, 163, 175, 0.3)",
//                 borderRadius: "6px",
//                 fontSize: "12px",
//                 color: messageType === "image_and_text" ? "#3b82f6" : "#999",
//                 fontWeight: 600,
//               }}>
//                 {messageType === "image_and_text" ? "📋 Text + Image" : "📝 Text Only"}
//               </span>
//             </div>
//           </div>

//           {/* EVENT DETAILS - DYNAMIC */}
//           <div style={{
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: "12px",
//             padding: "24px",
//           }}>
//             <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//               📝 Event Details
//             </h3>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
//               {Object.entries(eventDetails || {}).map(([key, value]) => (
//                 <div key={key}>
//                   <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
//                     {key
//                       .replace(/([A-Z])/g, " $1")
//                       .replace(/^./, (str) => str.toUpperCase())}
//                   </p>
//                   <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
//                     {typeof value === "object" ? JSON.stringify(value) : String(value) || "—"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* GUESTS */}
//           <div style={{
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: "12px",
//             padding: "24px",
//           }}>
//             <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//               👥 Guests
//             </h3>
//             <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
//               {selectedGuests.length} {selectedGuests.length === 1 ? "guest" : "guests"} selected
//             </p>
//           </div>
//         </div>

//         {/* RIGHT - PRICING */}
//         <div style={{
//           background: "linear-gradient(135deg, rgba(233, 30, 140, 0.1), rgba(255, 82, 82, 0.1))",
//           border: "1px solid rgba(233, 30, 140, 0.2)",
//           borderRadius: "12px",
//           padding: "24px",
//           height: "fit-content",
//         }}>
//           <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//             💳 Pricing
//           </h3>

//           {pricingLoading ? (
//             <div style={{ textAlign: "center", color: "#999", padding: "16px" }}>
//               <p>⟳ Loading pricing...</p>
//             </div>
//           ) : pricingBreakdown ? (
//             <>
//               <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
//                 {pricingBreakdown.baseCost > 0 && (
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#999" }}>
//                     <span>Base Cost</span>
//                     <span>₹{pricingBreakdown.baseCost.toFixed(2)}</span>
//                   </div>
//                 )}

//                 {pricingBreakdown.perGuestCost > 0 && selectedGuests.length > 0 && (
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#999" }}>
//                     <span>Per Guest (×{selectedGuests.length})</span>
//                     <span>₹{pricingBreakdown.perGuestTotal.toFixed(2)}</span>
//                   </div>
//                 )}

//                 {pricingBreakdown.platformFee > 0 && (
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#999" }}>
//                     <span>Platform Fee ({pricingBreakdown.platformFeePercentage.toFixed(1)}%)</span>
//                     <span>₹{pricingBreakdown.platformFee.toFixed(2)}</span>
//                   </div>
//                 )}
//               </div>

//               <div style={{
//                 borderTop: "1px solid rgba(255,255,255,0.1)",
//                 paddingTop: "16px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 fontSize: "18px",
//                 fontWeight: 700,
//               }}>
//                 <span style={{ color: "#fff" }}>Total</span>
//                 <span style={{ color: "#e91e8c" }}>₹{pricingBreakdown.total.toFixed(2)}</span>
//               </div>
//             </>
//           ) : (
//             <div style={{ color: "#999", textAlign: "center", padding: "16px" }}>
//               <p>Unable to load pricing</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* NAVIGATION */}
//       <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
//         <button
//           onClick={goPrev}
//           disabled={loading || paymentStarted}
//           style={{
//             padding: "14px 24px",
//             borderRadius: "8px",
//             border: "1px solid rgba(255,255,255,0.2)",
//             background: "rgba(255,255,255,0.05)",
//             color: "#fff",
//             fontWeight: 600,
//             cursor: loading || paymentStarted ? "not-allowed" : "pointer",
//             opacity: loading || paymentStarted ? 0.5 : 1,
//             transition: "all 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             if (!loading && !paymentStarted) {
//               (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
//           }}
//         >
//           ← Back
//         </button>

//         <button
//           onClick={handlePayment}
//           disabled={loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading}
//           style={{
//             marginLeft: "auto",
//             padding: "14px 32px",
//             borderRadius: "8px",
//             border: "none",
//             background: loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading
//               ? "rgba(233, 30, 140, 0.5)"
//               : "linear-gradient(135deg, #e91e8c, #ff5252)",
//             color: "#fff",
//             fontWeight: 700,
//             fontSize: "15px",
//             cursor: loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading
//               ? "not-allowed"
//               : "pointer",
//             boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
//             transition: "all 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             if (!loading && !paymentStarted && selectedTemplate && pricingBreakdown && !pricingLoading) {
//               (e.currentTarget as HTMLElement).style.boxShadow =
//                 "0 12px 35px rgba(233, 30, 140, 0.5)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.boxShadow =
//               "0 8px 25px rgba(233, 30, 140, 0.3)";
//           }}
//         >
//           {loading
//             ? "⟳ Creating Order..."
//             : paymentStarted
//             ? "⟳ Processing..."
//             : `💳 Pay ₹${pricingBreakdown?.total.toFixed(2) || "0.00"}`}
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useCreateOrderMutation,
//   useVerifyPaymentMutation,
//   useCreateEventMutation,
//   useGetPricingConfigQuery,
// } from "@/store/apiSlice";

// import {
//   useCreateEvent,
// } from "@/hooks/useCreateEvent";

// import { useMessageType } from "@/hooks/usePricing";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface PricingBreakdown {
//   baseCost: number;
//   perGuestCost: number;
//   perGuestTotal: number;
//   subtotal: number;
//   platformFeePercentage: number;
//   platformFee: number;
//   total: number;
// }

// export default function Step4_ReviewAndPay() {
//   const {
//     selectedTemplate,
//     eventDetails,
//     selectedGuests,
//     goNext,
//     goPrev,
//     setError,
//     error,
//     setPaymentSuccess,
//     setEventCreated,
//   } = useCreateEvent();

//   const [createOrder] =
//     useCreateOrderMutation();

//   const [verifyPayment] =
//     useVerifyPaymentMutation();

//   const [createEvent] =
//     useCreateEventMutation();

//   const [loading, setLoading] =
//     useState(false);

//   const [
//     paymentStarted,
//     setPaymentStarted,
//   ] = useState(false);

//   // =====================================================
//   // DYNAMIC MESSAGE TYPE
//   // =====================================================
//   const messageType = useMessageType(selectedTemplate);

//   // =====================================================
//   // GET PRICING CONFIG
//   // =====================================================
//   const { data: pricingResponse, isLoading: pricingLoading } = useGetPricingConfigQuery(messageType);
//   const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown | null>(null);

//   // =====================================================
//   // CALCULATE PRICING
//   // =====================================================
//   useEffect(() => {
//     if (pricingResponse?.data && selectedGuests.length > 0) {
//       const pricingConfig = pricingResponse.data;
//       const baseCost = parseFloat(pricingConfig.baseCost || "0");
//       const perGuestCost = parseFloat(pricingConfig.perGuestCost || "0");
//       const platformFeePercent = parseFloat(pricingConfig.platformFeePercentage || "0");

//       const perGuestTotal = perGuestCost * selectedGuests.length;
//       const subtotal = baseCost + perGuestTotal;
//       const platformFee = (subtotal * platformFeePercent) / 100;
//       const total = subtotal + platformFee;

//       setPricingBreakdown({
//         baseCost,
//         perGuestCost,
//         perGuestTotal,
//         subtotal,
//         platformFeePercentage: platformFeePercent,
//         platformFee,
//         total,
//       });
//     }
//   }, [pricingResponse, selectedGuests.length]);

//   // =====================================================
//   // LOAD RAZORPAY
//   // =====================================================

//   useEffect(() => {
//     const script =
//       document.createElement(
//         "script"
//       );

//     script.src =
//       "https://checkout.razorpay.com/v1/checkout.js";

//     script.async = true;

//     document.body.appendChild(
//       script
//     );

//     return () => {
//       if (
//         document.body.contains(
//           script
//         )
//       ) {
//         document.body.removeChild(
//           script
//         );
//       }
//     };
//   }, []);

//   // =====================================================
//   // PAYMENT
//   // =====================================================

//   const handlePayment =
//     async () => {
//       if (
//         !selectedTemplate?.id
//       ) {
//         setError(
//           "Template not selected"
//         );

//         return;
//       }

//       if (!pricingBreakdown) {
//         setError(
//           "Unable to load pricing. Please refresh and try again."
//         );
//         return;
//       }

//       if (!selectedGuests || selectedGuests.length === 0) {
//         setError(
//           "No guests selected"
//         );
//         return;
//       }

//       try {
//         setLoading(true);

//         setError(null);

//         // =========================================
//         // CREATE ORDER
//         // =========================================

//         const orderResponse =
//           await createOrder({
//             templateId:
//               selectedTemplate.id,

//             messageType,

//             guestCount:
//               selectedGuests.length,

//             amount: pricingBreakdown.total,
//           }).unwrap();

//         const {
//           orderId,
//           amount,
//         } = orderResponse.data;

//         setPaymentStarted(
//           true
//         );

//         // =========================================
//         // RAZORPAY
//         // =========================================

//         const options = {
//           key:
//             process.env
//               .NEXT_PUBLIC_RAZORPAY_KEY_ID,

//           amount:
//             amount,

//           currency:
//             "INR",

//           order_id:
//             orderId,

//           description: `${messageType} - ${selectedGuests.length} guests`,

//           handler:
//             async (
//               response: any
//             ) => {
//               try {
//                 // =================================
//                 // VERIFY PAYMENT
//                 // =================================

//                 await verifyPayment({
//                   razorpay_order_id:
//                     response.razorpay_order_id,

//                   razorpay_payment_id:
//                     response.razorpay_payment_id,

//                   razorpay_signature:
//                     response.razorpay_signature,
//                 }).unwrap();

//                 setPaymentSuccess(
//                   response.razorpay_payment_id
//                 );

//                 // =================================
//                 // CREATE EVENT
//                 // =================================

//                 const eventResponse =
//                   await createEvent(
//                     {
//                       templateId:
//                         selectedTemplate.id,

//                       messageType,

//                       templateParams:
//                         [
//                           eventDetails.groomName || "",
//                           eventDetails.brideName || "",
//                           eventDetails.eventDate || "",
//                         ],

//                       guestIds:
//                         selectedGuests,

//                       paymentId:
//                         response.razorpay_payment_id,
//                     }
//                   ).unwrap();

//                 setEventCreated(
//                   eventResponse?.data?.id ||
//                   eventResponse?.data?.eventId ||
//                   eventResponse?.id ||
//                   ""
//                 );

//                 goNext();
//               } catch (
//                 error: any
//               ) {
//                 console.error(
//                   "Event creation failed:",
//                   error
//                 );

//                 setError(
//                   error?.data?.message ||
//                   "Payment verified but event creation failed"
//                 );

//                 setPaymentStarted(
//                   false
//                 );

//                 setLoading(
//                   false
//                 );
//               }
//             },

//           prefill: {
//             name:
//               eventDetails.groomName ||
//               "Guest",

//             email:
//               "user@example.com",
//           },

//           theme: {
//             color:
//               "#e91e8c",
//           },

//           modal: {
//             ondismiss:
//               () => {
//                 setPaymentStarted(
//                   false
//                 );

//                 setLoading(
//                   false
//                 );

//                 setError(
//                   "Payment cancelled"
//                 );
//               },
//           },
//         };

//         const razorpay =
//           new window.Razorpay(
//             options
//           );

//         razorpay.open();
//       } catch (err: any) {
//         setError(
//           err?.data
//             ?.message ||
//             "Failed to create order"
//         );

//         setPaymentStarted(
//           false
//         );

//         setLoading(false);
//       }
//     };

//   return (
//     <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 16px" }}>
//       {/* HEADER */}
//       <div style={{ marginBottom: "32px" }}>
//         <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
//           Step 4 of 5: Review & Pay
//         </h2>
//         <p style={{ color: "#999", fontSize: "14px" }}>
//           Review your event and complete payment
//         </p>
//       </div>

//       {/* ERROR */}
//       {error && (
//         <div style={{
//           marginBottom: "24px",
//           padding: "16px",
//           background: "rgba(239, 68, 68, 0.1)",
//           border: "1px solid rgba(239, 68, 68, 0.3)",
//           borderRadius: "8px",
//           color: "#fca5a5",
//           fontSize: "14px",
//         }}>
//           ⚠️ {error}
//         </div>
//       )}

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
//         {/* LEFT - EVENT DETAILS */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
//           {/* TEMPLATE */}
//           <div style={{
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: "12px",
//             padding: "24px",
//           }}>
//             <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//               📋 Selected Template
//             </h3>
//             <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>
//               {selectedTemplate?.title || selectedTemplate?.name || "—"}
//             </p>
//             <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//               {selectedTemplate?.category && (
//                 <span style={{
//                   display: "inline-block",
//                   padding: "6px 12px",
//                   background: "rgba(233, 30, 140, 0.2)",
//                   border: "1px solid rgba(233, 30, 140, 0.3)",
//                   borderRadius: "6px",
//                   fontSize: "12px",
//                   color: "#e91e8c",
//                   fontWeight: 600,
//                 }}>
//                   {selectedTemplate.category}
//                 </span>
//               )}
//               <span style={{
//                 display: "inline-block",
//                 padding: "6px 12px",
//                 background: messageType === "image_and_text"
//                   ? "rgba(59, 130, 246, 0.2)"
//                   : "rgba(156, 163, 175, 0.2)",
//                 border: messageType === "image_and_text"
//                   ? "1px solid rgba(59, 130, 246, 0.3)"
//                   : "1px solid rgba(156, 163, 175, 0.3)",
//                 borderRadius: "6px",
//                 fontSize: "12px",
//                 color: messageType === "image_and_text" ? "#3b82f6" : "#999",
//                 fontWeight: 600,
//               }}>
//                 {messageType === "image_and_text" ? "📋 Text + Image" : "📝 Text Only"}
//               </span>
//             </div>
//           </div>

//           {/* EVENT DETAILS */}
//           <div style={{
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: "12px",
//             padding: "24px",
//           }}>
//             <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//               📝 Event Details
//             </h3>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
//               <div>
//                 <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
//                   Groom Name
//                 </p>
//                 <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
//                   {eventDetails?.groomName || "—"}
//                 </p>
//               </div>
//               <div>
//                 <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
//                   Bride Name
//                 </p>
//                 <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
//                   {eventDetails?.brideName || "—"}
//                 </p>
//               </div>
//               <div>
//                 <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
//                   Event Date
//                 </p>
//                 <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
//                   {eventDetails?.eventDate
//                     ? new Date(eventDetails.eventDate).toLocaleDateString()
//                     : "—"}
//                 </p>
//               </div>
//               <div>
//                 <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
//                   Event Time
//                 </p>
//                 <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
//                   {eventDetails?.eventTime || "—"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* GUESTS */}
//           <div style={{
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: "12px",
//             padding: "24px",
//           }}>
//             <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//               👥 Guests
//             </h3>
//             <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>
//               {selectedGuests.length} {selectedGuests.length === 1 ? "guest" : "guests"} selected
//             </p>
//             <p style={{ fontSize: "12px", color: "#999" }}>
//               Invites will be sent via WhatsApp
//             </p>
//           </div>
//         </div>

//         {/* RIGHT - PRICING */}
//         <div style={{
//           background: "linear-gradient(135deg, rgba(233, 30, 140, 0.1), rgba(255, 82, 82, 0.1))",
//           border: "1px solid rgba(233, 30, 140, 0.2)",
//           borderRadius: "12px",
//           padding: "24px",
//           height: "fit-content",
//         }}>
//           <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
//             💳 Pricing
//           </h3>

//           {pricingLoading ? (
//             <div style={{ textAlign: "center", color: "#999", padding: "16px" }}>
//               <p>⟳ Loading pricing...</p>
//             </div>
//           ) : pricingBreakdown ? (
//             <>
//               <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
//                 {pricingBreakdown.baseCost > 0 && (
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#999" }}>
//                     <span>Base Cost</span>
//                     <span>₹{pricingBreakdown.baseCost.toFixed(2)}</span>
//                   </div>
//                 )}

//                 {pricingBreakdown.perGuestCost > 0 && selectedGuests.length > 0 && (
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#999" }}>
//                     <span>Per Guest (×{selectedGuests.length})</span>
//                     <span>₹{pricingBreakdown.perGuestTotal.toFixed(2)}</span>
//                   </div>
//                 )}

//                 {pricingBreakdown.platformFee > 0 && (
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#999" }}>
//                     <span>Platform Fee ({pricingBreakdown.platformFeePercentage.toFixed(1)}%)</span>
//                     <span>₹{pricingBreakdown.platformFee.toFixed(2)}</span>
//                   </div>
//                 )}
//               </div>

//               <div style={{
//                 borderTop: "1px solid rgba(255,255,255,0.1)",
//                 paddingTop: "16px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 fontSize: "18px",
//                 fontWeight: 700,
//               }}>
//                 <span style={{ color: "#fff" }}>Total</span>
//                 <span style={{ color: "#e91e8c" }}>₹{pricingBreakdown.total.toFixed(2)}</span>
//               </div>
//             </>
//           ) : (
//             <div style={{ color: "#999", textAlign: "center", padding: "16px" }}>
//               <p>Unable to load pricing</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* NAVIGATION */}
//       <div style={{ display: "flex", gap: "12px", marginTop: "48px", marginBottom: "32px" }}>
//         <button
//           onClick={goPrev}
//           disabled={loading || paymentStarted}
//           style={{
//             padding: "14px 24px",
//             borderRadius: "8px",
//             border: "1px solid rgba(255,255,255,0.2)",
//             background: "rgba(255,255,255,0.05)",
//             color: "#fff",
//             fontWeight: 600,
//             cursor: loading || paymentStarted ? "not-allowed" : "pointer",
//             opacity: loading || paymentStarted ? 0.5 : 1,
//             transition: "all 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             if (!loading && !paymentStarted) {
//               (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
//           }}
//         >
//           ← Back
//         </button>

//         <button
//           onClick={handlePayment}
//           disabled={loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading || selectedGuests.length === 0}
//           style={{
//             marginLeft: "auto",
//             padding: "14px 32px",
//             borderRadius: "8px",
//             border: "none",
//             background: loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading || selectedGuests.length === 0
//               ? "rgba(233, 30, 140, 0.5)"
//               : "linear-gradient(135deg, #e91e8c, #ff5252)",
//             color: "#fff",
//             fontWeight: 700,
//             fontSize: "15px",
//             cursor: loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading || selectedGuests.length === 0
//               ? "not-allowed"
//               : "pointer",
//             boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
//             transition: "all 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             if (!loading && !paymentStarted && selectedTemplate && pricingBreakdown && !pricingLoading && selectedGuests.length > 0) {
//               (e.currentTarget as HTMLElement).style.boxShadow =
//                 "0 12px 35px rgba(233, 30, 140, 0.5)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.boxShadow =
//               "0 8px 25px rgba(233, 30, 140, 0.3)";
//           }}
//         >
//           {loading
//             ? "⟳ Creating Order..."
//             : paymentStarted
//             ? "⟳ Processing..."
//             : `💳 Pay ₹${pricingBreakdown?.total.toFixed(2) || "0.00"}`}
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCreateEventMutation,
  useGetPricingConfigQuery,
} from "@/store/apiSlice";

import {
  useCreateEvent,
} from "@/hooks/useCreateEvent";

import { useMessageType } from "@/hooks/usePricing";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingBreakdown {
  baseCost: number;
  perGuestCost: number;
  perGuestTotal: number;
  subtotal: number;
  platformFeePercentage: number;
  platformFee: number;
  total: number;
}

export default function Step4_ReviewAndPay() {
  const {
    selectedTemplate,
    eventDetails,
    selectedGuests,
    goNext,
    goPrev,
    setError,
    error,
    setPaymentSuccess,
    setEventCreated,
  } = useCreateEvent();

  const [createOrder] =
    useCreateOrderMutation();

  const [verifyPayment] =
    useVerifyPaymentMutation();

  const [createEvent] =
    useCreateEventMutation();

  const [loading, setLoading] =
    useState(false);

  const [
    paymentStarted,
    setPaymentStarted,
  ] = useState(false);

  // =====================================================
  // DEBUG: LOG INCOMING DATA
  // =====================================================
  useEffect(() => {
    console.log("=== STEP 4 RECEIVED ===");
    console.log("eventDetails:", eventDetails);
    console.log("selectedTemplate:", selectedTemplate);
    console.log("selectedGuests:", selectedGuests);
  }, [eventDetails, selectedTemplate, selectedGuests]);

  // =====================================================
  // DYNAMIC MESSAGE TYPE
  // =====================================================
  const messageType = useMessageType(selectedTemplate);

  // =====================================================
  // GET PRICING CONFIG
  // =====================================================
  const { data: pricingResponse, isLoading: pricingLoading } = useGetPricingConfigQuery(messageType);
  const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown | null>(null);

  // =====================================================
  // CALCULATE PRICING
  // =====================================================
  useEffect(() => {
    if (pricingResponse?.data && selectedGuests.length > 0) {
      const pricingConfig = pricingResponse.data;
      const baseCost = parseFloat(pricingConfig.baseCost || "0");
      const perGuestCost = parseFloat(pricingConfig.perGuestCost || "0");
      const platformFeePercent = parseFloat(pricingConfig.platformFeePercentage || "0");

      const perGuestTotal = perGuestCost * selectedGuests.length;
      const subtotal = baseCost + perGuestTotal;
      const platformFee = (subtotal * platformFeePercent) / 100;
      const total = subtotal + platformFee;

      setPricingBreakdown({
        baseCost,
        perGuestCost,
        perGuestTotal,
        subtotal,
        platformFeePercentage: platformFeePercent,
        platformFee,
        total,
      });
    }
  }, [pricingResponse, selectedGuests.length]);

  // =====================================================
  // LOAD RAZORPAY
  // =====================================================

  useEffect(() => {
    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(
      script
    );

    return () => {
      if (
        document.body.contains(
          script
        )
      ) {
        document.body.removeChild(
          script
        );
      }
    };
  }, []);

  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment =
    async () => {
      if (
        !selectedTemplate?.id
      ) {
        setError(
          "Template not selected"
        );

        return;
      }

      if (!pricingBreakdown) {
        setError(
          "Unable to load pricing. Please refresh and try again."
        );
        return;
      }

      if (!selectedGuests || selectedGuests.length === 0) {
        setError(
          "No guests selected"
        );
        return;
      }

      try {
        setLoading(true);

        setError(null);

        // =========================================
        // CREATE ORDER
        // =========================================

        const orderResponse =
          await createOrder({
            templateId:
              selectedTemplate.id,

            messageType,

            guestCount:
              selectedGuests.length,

            amount: pricingBreakdown.total,
          }).unwrap();

        const {
          orderId,
          amount,
        } = orderResponse.data;

        setPaymentStarted(
          true
        );

        // =========================================
        // RAZORPAY
        // =========================================

        const options = {
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            amount,

          currency:
            "INR",

          order_id:
            orderId,

          description: `${messageType} - ${selectedGuests.length} guests`,

          handler:
            async (
              response: any
            ) => {
              try {
                // =================================
                // VERIFY PAYMENT
                // =================================

                await verifyPayment({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }).unwrap();

                setPaymentSuccess(
                  response.razorpay_payment_id
                );

                // =================================
                // BUILD TEMPLATE PARAMS - ALL FIELDS
                // =================================

                const templateParams = {
                  guestName: "",
                  celebrantName: eventDetails?.celebrantName || eventDetails?.groomName || eventDetails?.brideName || "",
                  eventDate: eventDetails?.eventDate || "",
                  venueName: eventDetails?.venueName || "",
                  eventTime: eventDetails?.eventTime || "",
                  venueAddress: eventDetails?.venueAddress || "",
                  brideName: eventDetails?.brideName || "",
                  groomName: eventDetails?.groomName || "",
                  eventName: eventDetails?.eventName || "",
                  companyName: eventDetails?.companyName || "",
                };

                console.log("Sending templateParams:", templateParams);

                // =================================
                // CREATE EVENT
                // =================================

                const eventResponse =
                  await createEvent(
                    {
                      templateId:
                        selectedTemplate.id,

                      messageType,

                      templateParams,

                      guestIds:
                        selectedGuests,

                      paymentId:
                        response.razorpay_payment_id,
                    }
                  ).unwrap();

                console.log("Event created:", eventResponse);

                setEventCreated(
                  eventResponse?.data?.id ||
                  eventResponse?.data?.eventId ||
                  eventResponse?.id ||
                  ""
                );

                goNext();
              } catch (
                error: any
              ) {
                console.error(
                  "Event creation failed:",
                  error
                );

                setError(
                  error?.data?.message ||
                  "Payment verified but event creation failed"
                );

                setPaymentStarted(
                  false
                );

                setLoading(
                  false
                );
              }
            },

          prefill: {
            name:
              eventDetails?.celebrantName ||
              eventDetails?.groomName ||
              eventDetails?.brideName ||
              "Guest",

            email:
              "user@example.com",
          },

          theme: {
            color:
              "#e91e8c",
          },

          modal: {
            ondismiss:
              () => {
                setPaymentStarted(
                  false
                );

                setLoading(
                  false
                );

                setError(
                  "Payment cancelled"
                );
              },
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();
      } catch (err: any) {
        setError(
          err?.data
            ?.message ||
            "Failed to create order"
        );

        setPaymentStarted(
          false
        );

        setLoading(false);
      }
    };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 16px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Step 4 of 5: Review & Pay
        </h2>
        <p style={{ color: "#999", fontSize: "14px" }}>
          Review your event and complete payment
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{
          marginBottom: "24px",
          padding: "16px",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "8px",
          color: "#fca5a5",
          fontSize: "14px",
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
        {/* LEFT - EVENT DETAILS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* TEMPLATE */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
              📋 Selected Template
            </h3>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>
              {selectedTemplate?.title || selectedTemplate?.name || "—"}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selectedTemplate?.category && (
                <span style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  background: "rgba(233, 30, 140, 0.2)",
                  border: "1px solid rgba(233, 30, 140, 0.3)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#e91e8c",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}>
                  {selectedTemplate.category}
                </span>
              )}
              <span style={{
                display: "inline-block",
                padding: "6px 12px",
                background: messageType === "image_and_text"
                  ? "rgba(59, 130, 246, 0.2)"
                  : "rgba(156, 163, 175, 0.2)",
                border: messageType === "image_and_text"
                  ? "1px solid rgba(59, 130, 246, 0.3)"
                  : "1px solid rgba(156, 163, 175, 0.3)",
                borderRadius: "6px",
                fontSize: "12px",
                color: messageType === "image_and_text" ? "#3b82f6" : "#999",
                fontWeight: 600,
              }}>
                {messageType === "image_and_text" ? "📋 Text + Image" : "📝 Text Only"}
              </span>
            </div>
          </div>

          {/* EVENT DETAILS - DISPLAY ALL FROM eventDetails OBJECT */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
              📝 Event Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Groom Name */}
              {eventDetails?.groomName && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Groom Name
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.groomName}
                  </p>
                </div>
              )}

              {/* Bride Name */}
              {eventDetails?.brideName && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Bride Name
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.brideName}
                  </p>
                </div>
              )}

              {/* Celebrant Name */}
              {eventDetails?.celebrantName && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Celebrant Name
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.celebrantName}
                  </p>
                </div>
              )}

              {/* Event Date */}
              {eventDetails?.eventDate && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Event Date
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {new Date(eventDetails.eventDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Event Time */}
              {eventDetails?.eventTime && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Event Time
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.eventTime}
                  </p>
                </div>
              )}

              {/* Venue Name */}
              {eventDetails?.venueName && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Venue
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.venueName}
                  </p>
                </div>
              )}

              {/* Venue Address */}
              {eventDetails?.venueAddress && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Venue Address
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.venueAddress}
                  </p>
                </div>
              )}

              {/* Event Name (Corporate) */}
              {eventDetails?.eventName && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Event Name
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.eventName}
                  </p>
                </div>
              )}

              {/* Company Name (Corporate) */}
              {eventDetails?.companyName && (
                <div>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                    Company Name
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {eventDetails.companyName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* GUESTS */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
              👥 Guests
            </h3>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>
              {selectedGuests.length} {selectedGuests.length === 1 ? "guest" : "guests"} selected
            </p>
            <p style={{ fontSize: "12px", color: "#999" }}>
              Invites will be sent via WhatsApp
            </p>
          </div>
        </div>

        {/* RIGHT - PRICING */}
        <div style={{
          background: "linear-gradient(135deg, rgba(233, 30, 140, 0.1), rgba(255, 82, 82, 0.1))",
          border: "1px solid rgba(233, 30, 140, 0.2)",
          borderRadius: "12px",
          padding: "24px",
          height: "fit-content",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
            💳 Pricing
          </h3>

          {pricingLoading ? (
            <div style={{ textAlign: "center", color: "#999", padding: "16px" }}>
              <p>⟳ Loading pricing...</p>
            </div>
          ) : pricingBreakdown ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                {pricingBreakdown.baseCost > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#999" }}>
                    <span>Base Cost</span>
                    <span>₹{pricingBreakdown.baseCost.toFixed(2)}</span>
                  </div>
                )}

                {pricingBreakdown.perGuestCost > 0 && selectedGuests.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#999" }}>
                    <span>Per Guest (×{selectedGuests.length})</span>
                    <span>₹{pricingBreakdown.perGuestTotal.toFixed(2)}</span>
                  </div>
                )}

                {pricingBreakdown.platformFee > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#999" }}>
                    <span>Platform Fee ({pricingBreakdown.platformFeePercentage.toFixed(1)}%)</span>
                    <span>₹{pricingBreakdown.platformFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: 700,
              }}>
                <span style={{ color: "#fff" }}>Total</span>
                <span style={{ color: "#e91e8c" }}>₹{pricingBreakdown.total.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div style={{ color: "#999", textAlign: "center", padding: "16px" }}>
              <p>Unable to load pricing</p>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: "flex", gap: "12px", marginTop: "48px", marginBottom: "32px" }}>
        <button
          onClick={goPrev}
          disabled={loading || paymentStarted}
          style={{
            padding: "14px 24px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontWeight: 600,
            cursor: loading || paymentStarted ? "not-allowed" : "pointer",
            opacity: loading || paymentStarted ? 0.5 : 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading && !paymentStarted) {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
          }}
        >
          ← Back
        </button>

        <button
          onClick={handlePayment}
          disabled={loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading || selectedGuests.length === 0}
          style={{
            marginLeft: "auto",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "none",
            background: loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading || selectedGuests.length === 0
              ? "rgba(233, 30, 140, 0.5)"
              : "linear-gradient(135deg, #e91e8c, #ff5252)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "15px",
            cursor: loading || paymentStarted || !selectedTemplate || !pricingBreakdown || pricingLoading || selectedGuests.length === 0
              ? "not-allowed"
              : "pointer",
            boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading && !paymentStarted && selectedTemplate && pricingBreakdown && !pricingLoading && selectedGuests.length > 0) {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 35px rgba(233, 30, 140, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 25px rgba(233, 30, 140, 0.3)";
          }}
        >
          {loading
            ? "⟳ Creating Order..."
            : paymentStarted
            ? "⟳ Processing..."
            : `💳 Pay ₹${pricingBreakdown?.total.toFixed(2) || "0.00"}`}
        </button>
      </div>
    </div>
  );
}