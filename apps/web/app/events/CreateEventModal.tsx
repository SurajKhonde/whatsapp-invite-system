"use client";

import {
  useGetGuestsQuery,
  useGetTemplatesQuery,
  useCreateEventMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import { useEffect, useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";

type Props = {
  templateId: string | null;
  onClose: () => void;
};

// message type based on event — image invite = whatsapp_image
const MESSAGE_TYPE = "whatsapp_image";

export default function CreateEventModal({ templateId, onClose }: Props) {
  const { data: guestData, isLoading } = useGetGuestsQuery();
  const { data: templateData } = useGetTemplatesQuery();

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [createEvent] = useCreateEventMutation();
  const { loadScript } = useRazorpay();

  const guests = guestData?.data || [];
  const templates = templateData?.data || [];

  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [eventType, setEventType] = useState("birthday");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(templateId);
  const [step, setStep] = useState<"form" | "paying" | "creating">("form");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) setSelectedTemplate(templateId);
  }, [templateId]);

  const toggleGuest = (id: string) => {
    setSelectedGuests((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const selectedTemplateName = templates.find(
    (t: any) => t.id === selectedTemplate
  )?.title;

  async function handleClick() {
    setError(null);

    if (!selectedTemplate) return setError("Please select a template");
    if (selectedGuests.length === 0) return setError("Select at least one guest");

    try {
      // STEP 1 — Load Razorpay script
      const loaded = await loadScript();
      if (!loaded) return setError("Failed to load payment gateway. Check your connection.");

      setStep("paying");

      // STEP 2 — Create order on your backend
      const order = await createOrder({
        messageType: MESSAGE_TYPE,
        guestCount: selectedGuests.length,
      }).unwrap();

      // STEP 3 — Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "pilooopu Invites",
          description: `${selectedGuests.length} guests · ${MESSAGE_TYPE}`,
          theme: { color: "#ec4899" },

          handler: async (response: any) => {
            try {
              // STEP 4 — Verify payment on your backend
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();

              // STEP 5 — Payment verified, now create event
              setStep("creating");

              await createEvent({
                templateId: selectedTemplate,
                eventType,
                guests: selectedGuests,
              }).unwrap();

              resolve();
            } catch (err) {
              reject(err);
            }
          },

          modal: {
            ondismiss: () => {
              setStep("form"); // user closed modal without paying
              reject(new Error("Payment cancelled"));
            },
          },
        });

        rzp.open();
      });

      onClose(); // all done
    } catch (err: any) {
      if (err?.message !== "Payment cancelled") {
        setError(err?.data?.message || err?.message || "Something went wrong");
      }
      setStep("form");
    }
  }

  const buttonLabel = {
    form: `Pay & Create Event (${selectedGuests.length} guests)`,
    paying: "Opening Payment...",
    creating: "Creating Event...",
  }[step];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[520px] p-6 rounded-2xl shadow-2xl animate-scaleIn">

        <h2 className="text-xl font-bold mb-4 text-black">Create Event</h2>

        {/* EVENT TYPE */}
        <select
          className="w-full border rounded-lg p-2 mb-4 text-black"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="birthday">Birthday</option>
          <option value="wedding">Wedding</option>
          <option value="business">Business</option>
        </select>

        {/* TEMPLATE */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Select Template</p>
          {!templateId ? (
            <select
              className="w-full border rounded-lg p-2 text-black"
              value={selectedTemplate || ""}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Choose Template</option>
              {templates.map((t: any) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          ) : (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-sm text-gray-800 font-medium">
              🎉 {selectedTemplateName || "Loading..."}
            </div>
          )}
        </div>

        {/* GUEST LIST */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Select Guests
            {selectedGuests.length > 0 && (
              <span className="ml-2 text-pink-500 font-medium">
                {selectedGuests.length} selected
              </span>
            )}
          </p>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {isLoading && <p>Loading guests...</p>}
            {guests.map((g: any) => (
              <label
                key={g.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-pink-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium text-black">{g.name}</p>
                  <p className="text-sm text-gray-500">{g.phone}</p>
                </div>
                <input
                  type="checkbox"
                  className="accent-pink-500"
                  checked={selectedGuests.includes(g.id)}
                  onChange={() => toggleGuest(g.id)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* PRICE PREVIEW */}
        {selectedGuests.length > 0 && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-gray-700">
            <p>Image invite · {selectedGuests.length} guests</p>
            <p className="text-xs text-gray-400 mt-1">
              Final price shown on payment screen
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            disabled={step !== "form"}
          >
            Cancel
          </button>

          <button
            disabled={step !== "form"}
            onClick={handleClick}
            className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:scale-105 transition disabled:opacity-50"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.2s ease; }
      `}</style>
    </div>
  );
}