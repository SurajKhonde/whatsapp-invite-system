"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useGetTemplateByIdQuery } from "@/store/apiSlice";
import styles from "./step1.module.css";

export default function Step1_TemplateSelection() {
  const router = useRouter();

  const { nextStep, setLoading, setTemplate: setTemplateToRedux, setError, error } = useCreateEvent();

  const params = useSearchParams();
  const templateIdFromUrl = params.get("templateId");
  const imageIdsFromUrl = params.getAll("imageId");

  const [selectedId] = useState<string | null>(templateIdFromUrl);
  const [selectedImageIds] = useState<string[]>(imageIdsFromUrl || []);
  const [template, setTemplate] = useState<any>(null);

  const { data: selectedTemplateDetail, isLoading: templateDetailLoading } = useGetTemplateByIdQuery(
    selectedId || "",
    { skip: !selectedId }
  );

  // Set template from API response AND save to Redux
  useEffect(() => {
    if (selectedTemplateDetail?.data) {
      console.log("Setting template:", selectedTemplateDetail.data);
      setTemplate(selectedTemplateDetail.data);
      setTemplateToRedux(selectedTemplateDetail.data);
    }
  }, [selectedTemplateDetail?.data, setTemplateToRedux]);

  useEffect(() => {
    setLoading(templateDetailLoading);
  }, [templateDetailLoading, setLoading]);

  const handleNext = () => {
    if (selectedId && template) {
      console.log("Step 1 - Saving to Redux:", template);
      setTemplateToRedux(template);
      console.log("Step 1 - Called setTemplateToRedux");
      nextStep();
    }
  };

  const handleBack = () => {
    router.push("/templates");
  };

  if (templateDetailLoading && !template) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>⟳</div>
          <p className={styles.loadingText}>Loading template preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2 className={styles.heading}>Preview Your WhatsApp Message</h2>
        <p className={styles.subheading}>
          This is how your message will appear to your guests on WhatsApp
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {/* WHATSAPP PREVIEW */}
      {template && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {/* Phone Frame */}
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              background: "#fff",
              borderRadius: 40,
              padding: 12,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {/* Phone Status Bar */}
            <div
              style={{
                background: "#000",
                color: "#fff",
                padding: "8px 16px",
                fontSize: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "30px 30px 0 0",
              }}
            >
              <span>9:41</span>
              <span>WhatsApp</span>
              <span>📶</span>
            </div>

            {/* Chat Header */}
            <div
              style={{
                background: "#075e54",
                color: "#fff",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
              }}
            >
              <span style={{ fontSize: 20 }}>👥</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>Invitation</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Today</div>
              </div>
              <span>⋮</span>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                background: "#efeae2",
                padding: "16px",
                minHeight: 400,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Message Bubble */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    background: "#dcf8c6",
                    borderRadius: "18px 18px 4px 18px",
                    padding: "12px 16px",
                    maxWidth: "85%",
                    wordWrap: "break-word",
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "#000",
                  }}
                >
                  {template.textContent || template.description}
                </div>
              </div>

              {/* Time Indicator */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 4,
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(0,0,0,0.5)" }}>
                  9:42 ✓✓
                </span>
              </div>
            </div>

            {/* Chat Input */}
            <div
              style={{
                background: "#fff",
                padding: "12px 16px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                borderRadius: "0 0 30px 30px",
              }}
            >
              <span style={{ fontSize: 18 }}>😊</span>
              <input
                type="text"
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  border: "none",
                  background: "#f0f0f0",
                  padding: "10px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  outline: "none",
                }}
                disabled
              />
              <span style={{ fontSize: 18 }}>📎</span>
              <span style={{ fontSize: 18 }}>🎙️</span>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE DETAILS */}
      {template && (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 30,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#e91e8c" }}>
            📋 Message Details
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: "rgba(245,240,255,0.6)", marginBottom: 4 }}>
                Template Name
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                {template.title}
              </p>
            </div>

            <div>
              <p style={{ fontSize: 12, color: "rgba(245,240,255,0.6)", marginBottom: 4 }}>
                Template Type
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                {template.hasImage ? "With Images" : "Text Only"}
              </p>
            </div>

            {template.placeholders && (
              (Array.isArray(template.placeholders)
                ? template.placeholders.length > 0
                : Object.keys(template.placeholders).length > 0) && (
                <div>
                  <p style={{ fontSize: 12, color: "rgba(245,240,255,0.6)", marginBottom: 4 }}>
                    Custom Fields
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Array.isArray(template.placeholders)
                      ? template.placeholders.map((p: any, idx: number) => (
                          <span
                            key={idx}
                            style={{
                              background: "rgba(233, 30, 140, 0.2)",
                              padding: "4px 10px",
                              borderRadius: 4,
                              fontSize: 12,
                            }}
                          >
                            {p.key}
                          </span>
                        ))
                      : Object.keys(template.placeholders).map((key) => (
                          <span
                            key={key}
                            style={{
                              background: "rgba(233, 30, 140, 0.2)",
                              padding: "4px 10px",
                              borderRadius: 4,
                              fontSize: 12,
                            }}
                          >
                            {key}
                          </span>
                        ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            flex: 1,
            maxWidth: 400,
            padding: "14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
          }}
        >
          ← Back to Templates
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedId || templateDetailLoading}
          style={{
            flex: 1,
            maxWidth: 400,
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #e91e8c, #ff5252)",
            color: "white",
            fontWeight: 700,
            cursor: templateDetailLoading ? "not-allowed" : "pointer",
            fontSize: 14,
            opacity: templateDetailLoading ? 0.6 : 1,
            transition: "all 0.3s ease",
            boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (!templateDetailLoading) {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 35px rgba(233, 30, 140, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 25px rgba(233, 30, 140, 0.3)";
          }}
        >
          {templateDetailLoading ? "Loading..." : "Continue to Event Details →"}
        </button>
      </div>
    </div>
  );
}