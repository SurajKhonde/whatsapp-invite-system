"use client";

import { useEffect, useState } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useMessageType } from "@/hooks/usePricing";

export default function Step2_EventDetails() {
  const {
    selectedTemplate,
    eventDetails,
    goNext,
    goPrev,
    setEventDetails,
    setLoading,
    setError,
    error,
    loading,
  } = useCreateEvent();

  // Determine message type from template
  const messageType = useMessageType(selectedTemplate);

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Get placeholders from selected template - FILTER OUT GUEST FIELDS
  const guestFieldsToExclude = ['guestName', 'guest', 'recipient', 'to'];
  const eventPlaceholders = selectedTemplate?.placeholders?.filter((p: any) => 
    !guestFieldsToExclude.some(field => p.key.toLowerCase().includes(field.toLowerCase()))
  ) || [];

  const placeholders = eventPlaceholders;
  const templateTitle = selectedTemplate?.title || "Event";

  console.log("Step 2 - selectedTemplate:", selectedTemplate);
  console.log("Step 2 - messageType:", messageType);
  console.log("Step 2 - placeholders:", placeholders);

  // Initialize form with empty values for each placeholder
  useEffect(() => {
    if (selectedTemplate?.id && placeholders.length > 0) {
      const initialData: Record<string, string> = {};
      placeholders.forEach((p: any) => {
        initialData[p.key] = eventDetails[p.key] || "";
      });
      setFormData(initialData);
    }
  }, [selectedTemplate?.id]);

  setLoading(false);

  // Handle form input changes
  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    // Check if all fields are filled
    const emptyFields = placeholders.filter((p: any) => !formData[p.key]);
    if (emptyFields.length > 0) {
      setError(`Please fill all fields: ${emptyFields.map((p: any) => p.label).join(", ")}`);
      return;
    }

    // Save form data to Redux
    setEventDetails(formData);
    goNext();
  };

  if (!selectedTemplate) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
        <p style={{ color: "#999" }}>No template selected. Please go back to Step 1.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 16px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Step 2 of 5: Customize Event Details
        </h2>
        <p style={{ color: "#999", fontSize: "14px" }}>
          Fill in the details for: <span style={{ fontWeight: 600, color: "#fff" }}>{templateTitle}</span>
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            color: "#fca5a5",
            fontSize: "14px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
        {/* LEFT SIDE: FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>📝 Event Information</h3>

          {placeholders.length > 0 ? (
            placeholders.map((placeholder: any, idx: number) => (
              <div key={idx}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: "8px",
                  }}
                >
                  {placeholder.label} *
                </label>
                <input
                  type={
                    placeholder.key.toLowerCase().includes("date")
                      ? "date"
                      : placeholder.key.toLowerCase().includes("time")
                      ? "time"
                      : "text"
                  }
                  value={formData[placeholder.key] || ""}
                  onChange={(e) => handleInputChange(placeholder.key, e.target.value)}
                  placeholder={`Enter ${placeholder.label.toLowerCase()}`}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(233, 30, 140, 0.3)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
              </div>
            ))
          ) : (
            <p style={{ color: "#999" }}>No custom fields for this template.</p>
          )}

          {/* MESSAGE TYPE SELECTION - AUTO DETERMINED */}
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#fff", display: "block", marginBottom: "12px" }}>
              Message Type
            </label>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "12px" }}>
              {selectedTemplate?.hasImage
                ? "📋 This template supports images. Text + Image will be sent."
                : "📝 This template is text-only."}
            </p>
            <div
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(59, 130, 246, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="radio" checked={true} disabled style={{ cursor: "default" }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                  {messageType === "image_and_text" ? "📋 Text + Image" : "📝 Text Only"}
                </span>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              ℹ️ Message type is determined by the template
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(233, 30, 140, 0.1), rgba(255, 82, 82, 0.1))",
              border: "1px solid rgba(233, 30, 140, 0.2)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>
              📋 Summary
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#999" }}>Template:</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                  {selectedTemplate?.title}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#999" }}>Message Type:</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                  {messageType === "image_and_text" ? "Text + Image" : "Text Only"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span style={{ fontSize: "12px", color: "#999" }}>Fields Filled:</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                  {Object.values(formData).filter(Boolean).length} / {placeholders.length}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#999" }}>Status:</span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color:
                      Object.values(formData).filter(Boolean).length === placeholders.length
                        ? "#4ade80"
                        : "#fbbf24",
                  }}
                >
                  {Object.values(formData).filter(Boolean).length === placeholders.length
                    ? "✓ Complete"
                    : "⚠ Incomplete"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: "flex", gap: "12px", marginTop: "48px", marginBottom: "32px" }}>
        <button
          onClick={goPrev}
          disabled={loading}
          style={{
            padding: "14px 24px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "all 0.2s",
            fontSize: "14px",
          }}
          onMouseEnter={(e) => {
            if (!loading) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
          }}
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={loading || Object.values(formData).filter(Boolean).length !== placeholders.length}
          style={{
            marginLeft: "auto",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "none",
            background:
              loading || Object.values(formData).filter(Boolean).length !== placeholders.length
                ? "rgba(233, 30, 140, 0.5)"
                : "linear-gradient(135deg, #e91e8c, #ff5252)",
            color: "#fff",
            fontWeight: 700,
            cursor:
              loading || Object.values(formData).filter(Boolean).length !== placeholders.length
                ? "not-allowed"
                : "pointer",
            opacity:
              loading || Object.values(formData).filter(Boolean).length !== placeholders.length ? 0.6 : 1,
            transition: "all 0.2s",
            fontSize: "14px",
            boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (
              !loading &&
              Object.values(formData).filter(Boolean).length === placeholders.length
            ) {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 35px rgba(233, 30, 140, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 25px rgba(233, 30, 140, 0.3)";
          }}
        >
          {loading ? "Loading..." : "Continue to Select Guests →"}
        </button>
      </div>
    </div>
  );
}