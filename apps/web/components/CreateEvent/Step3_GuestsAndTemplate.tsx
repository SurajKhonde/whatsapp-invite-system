"use client";

import { useState } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import styles from "./step3.module.css";

export default function Step3_GuestsAndTemplate() {
  const { guests, selectedTemplate, templateParams, setTemplateParams, nextStep } = useCreateEvent();
  const [includeImage, setIncludeImage] = useState(selectedTemplate?.hasImage ?? false);

  const handleNext = () => {
    // Store image preference
    if (!includeImage) {
      // If not including image, clear it
      setTemplateParams({ ...templateParams, imageUrl: null });
    }
    nextStep();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Selected Guests</h3>
        <p className={styles.guestCount}>
          {guests.length} guest{guests.length !== 1 ? "s" : ""} ready to send
        </p>
        
        <div className={styles.guestList}>
          {guests.map((guest, i) => (
            <div key={i} className={styles.guestItem}>
              <div>
                <div className={styles.guestName}>{guest.name}</div>
                <div className={styles.guestMeta}>{guest.phone}</div>
              </div>
              <span className={styles.relationBadge}>{guest.relation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Option - Only if template supports it */}
      {selectedTemplate?.hasImage && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Message Preview</h3>
            <span className={styles.sectionHint}>Optional</span>
          </div>

          <div className={styles.imageToggle}>
            <div className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={includeImage}
                onChange={(e) => setIncludeImage(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.toggleText}>
                ✨ Add image to invites
              </span>
            </div>
            <p className={styles.toggleHint}>
              {includeImage 
                ? "Image will be attached to each WhatsApp message"
                : "Messages will be text-only (recommended for faster delivery)"}
            </p>
          </div>

          {includeImage && (
            <div className={styles.imagePreview}>
              <div className={styles.previewPlaceholder}>
                <span>📸</span>
                <p>Image preview will appear here</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Template Details</h3>
        <div className={styles.templateInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Template</span>
            <span className={styles.value}>{selectedTemplate?.title}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Type</span>
            <span className={styles.value}>
              {includeImage ? "With Image" : "Text Only"}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{selectedTemplate?.category}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button onClick={handleNext} className={styles.nextBtn}>
        Continue to Review & Pay →
      </button>
    </div>
  );
}