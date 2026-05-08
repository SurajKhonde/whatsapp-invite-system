"use client";

import {
  useGetGuestsQuery,
  useGetTemplatesQuery,
  useCreateEventMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import { useEffect, useState } from "react";
import { useRazorpay } from "../../hooks/useRazorpay";
import styles from "./CreateEventModal.module.css";

type Props = {
  templateId: string | null;
  onClose: () => void;
};

const MESSAGE_TYPE = "whatsapp_image";

/**
 * CreateEventModal Component
 * Handles event creation with guest selection and Razorpay payment integration
 * 
 * Features:
 * - Event type selection (Birthday, Wedding, Business)
 * - Template selection
 * - Multi-guest checkbox selection
 * - Razorpay payment integration
 * - Event creation on successful payment
 */
export default function CreateEventModal({ templateId, onClose }: Props) {
  // ==================== QUERIES & MUTATIONS ====================
  const { data: guestData, isLoading: isLoadingGuests } = useGetGuestsQuery();
  const { data: templateData } = useGetTemplatesQuery();

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [createEvent] = useCreateEventMutation();
  const { loadScript } = useRazorpay();

  // ==================== DATA ====================
  const guests = guestData?.data || [];
  const templates = templateData?.data || [];

  // ==================== STATE ====================
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [eventType, setEventType] = useState("birthday");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(templateId);
  const [step, setStep] = useState<"form" | "paying" | "creating">("form");
  const [error, setError] = useState<string | null>(null);

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (templateId) setSelectedTemplate(templateId);
  }, [templateId]);

  // ==================== HANDLERS ====================

  /**
   * Toggle guest selection
   */
  const handleToggleGuest = (id: string) => {
    setSelectedGuests((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  /**
   * Main handler for payment and event creation flow
   */
  const handleCreateEvent = async () => {
    setError(null);

    // Validation
    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    if (selectedGuests.length === 0) {
      setError("Select at least one guest");
      return;
    }

    try {
      // Step 1: Load Razorpay script
      const loaded = await loadScript();
      if (!loaded) {
        setError("Failed to load payment gateway. Check your connection.");
        return;
      }

      setStep("paying");

      // Step 2: Create order
      const order = await createOrder({
        messageType: MESSAGE_TYPE,
        guestCount: selectedGuests.length,
      }).unwrap();

      // Step 3: Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "పిlooopu Invites",
          description: `${selectedGuests.length} guests · ${MESSAGE_TYPE}`,
          theme: { color: "#ec4899" },

          handler: async (response: any) => {
            try {
              // Step 4: Verify payment
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();

              // Step 5: Create event
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
              setStep("form");
              reject(new Error("Payment cancelled"));
            },
          },
        });

        rzp.open();
      });

      onClose();
    } catch (err: any) {
      if (err?.message !== "Payment cancelled") {
        setError(err?.data?.message || err?.message || "Something went wrong");
      }
      setStep("form");
    }
  };

  // ==================== HELPERS ====================

  const selectedTemplateName = templates.find((t: any) => t.id === selectedTemplate)?.title;

  const buttonLabel = {
    form: `Pay & Create Event (${selectedGuests.length} guests)`,
    paying: "Opening Payment...",
    creating: "Creating Event...",
  }[step];

  // ==================== RENDER ====================

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* ========== TITLE ========== */}
        <h2 className={styles.title}>Create Event</h2>

        {/* ========== EVENT TYPE ========== */}
        <div className={styles.section}>
          <select
            className={styles.select}
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="birthday">Birthday</option>
            <option value="wedding">Wedding</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* ========== TEMPLATE ========== */}
        <div className={styles.section}>
          <label className={styles.label}>Select Template</label>
          {!templateId ? (
            <select
              className={styles.select}
              value={selectedTemplate || ""}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Choose Template</option>
              {templates.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          ) : (
            <div className={styles.templateDisplay}>
              🎉 {selectedTemplateName || "Loading..."}
            </div>
          )}
        </div>

        {/* ========== GUESTS ========== */}
        <div className={styles.guestListContainer}>
          <label className={styles.label}>
            <span className={styles.labelWithCount}>
              Select Guests
              {selectedGuests.length > 0 && (
                <span className={styles.count}>{selectedGuests.length} selected</span>
              )}
            </span>
          </label>

          <div className={styles.guestList}>
            {isLoadingGuests && <p className={styles.loading}>Loading guests...</p>}
            {guests.map((g: any) => (
              <label key={g.id} className={styles.guestItem}>
                <div className={styles.guestInfo}>
                  <p className={styles.guestName}>{g.name}</p>
                  <p className={styles.guestPhone}>{g.phone}</p>
                </div>
                <input
                  type="checkbox"
                  className={styles.guestCheckbox}
                  checked={selectedGuests.includes(g.id)}
                  onChange={() => handleToggleGuest(g.id)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* ========== PRICE PREVIEW ========== */}
        {selectedGuests.length > 0 && (
          <div className={styles.pricePreview}>
            <p className={styles.priceText}>
              Image invite · {selectedGuests.length} guests
            </p>
            <p className={styles.priceSubtext}>
              Final price shown on payment screen
            </p>
          </div>
        )}

        {/* ========== ERROR ========== */}
        {error && <p className={styles.error}>{error}</p>}

        {/* ========== ACTIONS ========== */}
        <div className={styles.actions}>
          <button
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={step !== "form"}
          >
            Cancel
          </button>

          <button
            disabled={step !== "form"}
            onClick={handleCreateEvent}
            className={styles.submitBtn}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}