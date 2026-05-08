"use client";

import { useCreateEvent } from "@/hooks/useCreateEvent";
import styles from "./step1.module.css";

export default function Step1_TemplateSelection() {
  const { templates, selectedTemplate, selectTemplate, nextStep } = useCreateEvent();

  const handleSelect = (templateId: string) => {
    selectTemplate(templateId);
  };

  const handleNext = () => {
    if (selectedTemplate) {
      nextStep();
    }
  };

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Choose a WhatsApp Template</h2>
      <p className={styles.subheading}>
        Select a pre-approved template. Images are optional add-ons.
      </p>

      <div className={styles.grid}>
        {templates.map((template) => (
          <div
            key={template.id}
            className={`${styles.card} ${selectedTemplate?.id === template.id ? styles.cardSelected : ""}`}
            onClick={() => handleSelect(template.id)}
          >
            {/* Icon */}
            <div className={styles.cardIcon}>
              {template.hasImage ? "🖼️" : "📄"}
            </div>

            {/* Title */}
            <h3 className={styles.cardTitle}>{template.title}</h3>

            {/* Description */}
            <p className={styles.cardDesc}>{template.description}</p>

            {/* Tags */}
            <div className={styles.tags}>
              {template.category && (
                <span className={styles.tag}>{template.category}</span>
              )}
              {template.hasImage ? (
                <span className={`${styles.tag} ${styles.tagImage}`}>
                  ✨ With Image (Optional)
                </span>
              ) : (
                <span className={styles.tag}>📝 Text Only</span>
              )}
            </div>

            {/* Template name */}
            <p className={styles.templateName}>{template.templateName}</p>

            {/* Selected badge */}
            {selectedTemplate?.id === template.id && (
              <div className={styles.selectedBadge}>✓ Selected</div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleNext}
        disabled={!selectedTemplate}
        className={styles.nextBtn}
      >
        Continue to Event Details →
      </button>
    </div>
  );
}