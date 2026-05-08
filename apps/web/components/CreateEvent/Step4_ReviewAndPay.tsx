"use client";

import { useEffect, useState } from "react";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCreateWhatsappEventMutation,
} from "@/store/apiSlice";
import { useCreateEvent } from "@/hooks/useCreateEvent";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Step4_ReviewAndPay() {
  const {
    selectedTemplate,
    eventDetails,
    messageType,
    imageGeneration,
    selectedGuests,
    whatsappTemplateId,
    pricing,
    goNext,
    goPrev,
    setError,
    error,
    paymentSuccess,
    eventCreated,
  } = useCreateEvent();

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [createWhatsappEvent] = useCreateWhatsappEventMutation();

  const [loading, setLoading] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!whatsappTemplateId) {
      setError("Template not selected");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Create order
      const orderResponse = await createOrder({
        messageType: messageType,
        guestCount: selectedGuests.length,
      }).unwrap();

      const { orderId, amount } = orderResponse;

      setPaymentStarted(true);

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            paymentSuccess(response.razorpay_payment_id);

            // Step 4: Create WhatsApp event (send invites)
            const eventResponse = await createWhatsappEvent({
              whatsappTemplateId: whatsappTemplateId,
              messageType: messageType,
              templateParams: [
                eventDetails.groomName,
                eventDetails.brideName,
                eventDetails.eventDate,
              ],
              imageUrl: imageGeneration.imageUrl || undefined,
              guestIds: selectedGuests,
              paymentId: response.razorpay_payment_id,
            }).unwrap();

            eventCreated(eventResponse.eventId);
            goNext(); // Move to Step 5 (Tracking)
          } catch (error) {
            setError("Payment verification failed. Please contact support.");
            setPaymentStarted(false);
            setLoading(false);
          }
        },
        prefill: {
          name: eventDetails.groomName || "",
          email: "user@example.com", // You should get this from auth
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: () => {
            setPaymentStarted(false);
            setLoading(false);
            setError("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.data?.message || "Failed to create order. Please try again.");
      setPaymentStarted(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Step 4 of 5: Review & Pay</h2>
        <p className="text-gray-600">Review your event details and complete payment</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Event Details Review */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📋 Event Details</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Groom Name</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {eventDetails.groomName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Bride Name</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {eventDetails.brideName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Event Date</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {new Date(eventDetails.eventDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Event Time</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {eventDetails.eventTime || "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Venue</p>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {eventDetails.venueName || "—"}
                </p>
                {eventDetails.venueAddress && (
                  <p className="text-sm text-gray-600 mt-1">{eventDetails.venueAddress}</p>
                )}
              </div>
            </div>
          </div>

          {/* Message Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">💬 Message Details</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Message Type</p>
                <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {messageType === "text_only" && "📝 Text Only"}
                  {messageType === "image_only" && "🖼️ Image Only"}
                  {messageType === "image_and_text" && "📋 Image + Text"}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">WhatsApp Template</p>
                <p className="text-base font-semibold text-gray-900 mt-2">
                  {selectedTemplate?.name || "—"}
                </p>
              </div>

              {imageGeneration.imageUrl && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Preview Image</p>
                  <img
                    src={imageGeneration.imageUrl}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Guests Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                👥 Guests ({selectedGuests.length})
              </h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-2">
                Invites will be sent to {selectedGuests.length} guests via WhatsApp.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">
                  {selectedGuests.length}
                  <span className="text-sm text-gray-600 font-normal ml-2">guests selected</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pricing & Payment */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Pricing</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Cost:</span>
                <span className="font-medium">₹{pricing.baseCost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Per Guest:</span>
                <span className="font-medium">
                  ₹{pricing.perGuestCost} × {selectedGuests.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ₹{pricing.baseCost + pricing.perGuestCost * selectedGuests.length}
                </span>
              </div>
            </div>

            <div className="border-t border-blue-200 pt-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Platform Fee (20%):</span>
                <span className="font-semibold">₹{pricing.profit}</span>
              </div>
            </div>

            <div className="bg-blue-600 rounded-lg p-4">
              <p className="text-white text-xs font-medium mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-white">₹{pricing.total}</p>
            </div>

            <div className="mt-4 bg-white bg-opacity-60 rounded-lg p-3 text-xs text-gray-600">
              <p className="font-medium mb-1">ℹ️ Note</p>
              <p>WhatsApp charges apply. Delivery within 24 hours.</p>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✓ Terms & Conditions</h3>

            <div className="space-y-2 text-sm text-gray-600">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-500 rounded"
                  defaultChecked
                />
                <span>
                  I agree to the{" "}
                  <span className="text-blue-600 hover:underline">terms of service</span>
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-500 rounded"
                  defaultChecked
                />
                <span>
                  I acknowledge that WhatsApp delivery is not guaranteed and may take up to 24 hours
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-500 rounded"
                  defaultChecked
                />
                <span>I understand that after payment, I cannot cancel or get a refund</span>
              </label>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💳 Payment Method</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span className="text-gray-600">Secure payment via Razorpay</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <span className="text-gray-600">Credit/Debit Card, UPI, Wallet</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="text-gray-600">256-bit SSL encryption</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-12 mb-6">
        <button
          onClick={goPrev}
          disabled={loading || paymentStarted}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Back
        </button>

        <button
          onClick={handlePayment}
          disabled={loading || paymentStarted}
          className="ml-auto px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              Creating Order...
            </>
          ) : paymentStarted ? (
            <>
              <span className="animate-spin">⟳</span>
              Processing Payment...
            </>
          ) : (
            <>💳 Pay ₹{pricing.total}</>
          )}
        </button>
      </div>

      {/* Security Note */}
      <div className="text-center text-xs text-gray-500 pb-4">
        <p>🔒 Your payment information is secure and encrypted</p>
      </div>
    </div>
  );
}
