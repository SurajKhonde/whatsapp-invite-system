"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import styles from "./create-event-modal.module.css";

// Import all 5 step components
import Step1_TemplateSelection from "./Step1_TemplateSelection";
import Step2_EventDetails from "./Step2_EventDetails";
import Step3_GuestsAndTemplate from "./Step3_GuestsAndTemplate";
import Step4_ReviewAndPay from "./Step4_ReviewAndPay";
import Step5_Tracking from "./Step5_Tracking";

interface CreateEventModalProps {
  templateId?: string | null;
  onClose: () => void;
}

export default function CreateEventModal({ templateId, onClose }: CreateEventModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentStep, resetCreateEvent, selectedTemplate } = useCreateEvent();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      resetCreateEvent();
      setIsClosing(false);
      onClose();
      router.push("/events");
    }, 300);
  };

  const handleComplete = () => {
    setTimeout(() => {
      resetCreateEvent();
      onClose();
      router.push("/events");
    }, 2000);
  };

  useEffect(() => {
    if (templateId && !selectedTemplate) {
      // Dispatch selectTemplate action if needed
    }
  }, [templateId, selectedTemplate]);

  const getTip = () => {
    switch (currentStep) {
      case 1:
        return "Select a WhatsApp template that matches your event. These are pre-approved by WhatsApp for bulk messaging.";
      case 2:
        return "Fill in your event details. You can optionally generate an AI image to include with your invites.";
      case 3:
        return "Select guests and choose the WhatsApp template. Pricing calculates automatically based on guest count.";
      case 4:
        return "Review everything carefully. Payment is secure via Razorpay. After payment, invites are sent immediately.";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`${styles.backdrop} ${isClosing ? styles.backropClosing : ""}`} 
        onClick={handleClose} 
      />

      {/* Modal Container */}
      <div className={`${styles.container} ${isClosing ? styles.containerClosing : ""}`}>
        {/* Modal Content */}
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.progress}>
              <span className={styles.stepText}>Step {currentStep} of 5</span>
              <div className={styles.progressDots}>
                {[1, 2, 3, 4, 5].map((step) => (
                  <div 
                    key={step} 
                    className={`${styles.dot} ${step <= currentStep ? styles.dotActive : ""}`} 
                  />
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className={styles.closeBtn}
              aria-label="Close modal"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Body - Step Components */}
          <div className={styles.body}>
            {currentStep === 1 && <Step1_TemplateSelection />}
            {currentStep === 2 && <Step2_EventDetails />}
            {currentStep === 3 && <Step3_GuestsAndTemplate />}
            {currentStep === 4 && <Step4_ReviewAndPay />}
            {currentStep === 5 && <Step5_Tracking />}
          </div>

          {/* Footer - Tips */}
          {currentStep < 5 && (
            <div className={styles.footer}>
              <span className={styles.footerIcon}>💡</span>
              <span>{getTip()}</span>
            </div>
          )}

          {/* Footer - Step 5 */}
          {currentStep === 5 && (
            <div className={`${styles.footer} ${styles.footerStep5}`}>
              <span className={styles.footerIcon}>🔔</span>
              <span>
                Your guests will receive WhatsApp invites shortly. Monitor delivery and read status
                in real-time above.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}