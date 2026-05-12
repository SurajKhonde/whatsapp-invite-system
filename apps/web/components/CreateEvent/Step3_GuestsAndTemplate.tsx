"use client";

import { useEffect, useState } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useGetGuestsQuery } from "@/store/apiSlice";
import { useMessageType } from "@/hooks/usePricing";

export default function Step3_GuestsAndTemplate() {
  const {
    selectedGuests,
    selectedTemplate,
    nextStep,
    goPrev,
    setLoading,
    setError,
    error,
    loading,
    selectGuestIds,
  } = useCreateEvent();

  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>(selectedGuests);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: guestsResponse, isLoading: guestsLoading, isError: guestsError } = useGetGuestsQuery();

  const allGuests = guestsResponse?.data || [];
  const categories = ["all", ...new Set(allGuests.map((g: any) => g.category || "other"))];
  const filteredGuests =
    selectedCategory === "all" ? allGuests : allGuests.filter((g: any) => g.category === selectedCategory);

  // Determine message type
  const messageType = useMessageType(selectedTemplate);

  useEffect(() => {
    setLoading(guestsLoading);
  }, [guestsLoading, setLoading]);

  useEffect(() => {
    if (guestsError) {
      setError("Failed to load guests. Please try again.");
    } else {
      setError(null);
    }
  }, [guestsError, setError]);

  useEffect(() => {
    selectGuestIds(selectedGuestIds);
  }, [selectedGuestIds, selectGuestIds]);

  const handleGuestToggle = (guestId: string) => {
    setSelectedGuestIds((prev) =>
      prev.includes(guestId) ? prev.filter((id) => id !== guestId) : [...prev, guestId]
    );
  };

  const handleSelectAllInCategory = () => {
    const categoryGuestIds = filteredGuests.map((g: any) => g.id);
    const allSelected = categoryGuestIds.every((id: string) => selectedGuestIds.includes(id));

    if (allSelected) {
      setSelectedGuestIds((prev) => prev.filter((id) => !categoryGuestIds.includes(id)));
    } else {
      setSelectedGuestIds((prev) => [...new Set([...prev, ...categoryGuestIds])]);
    }
  };

  const handleNext = () => {
    if (selectedGuestIds.length === 0) {
      setError("Please select at least one guest");
      return;
    }
    if (!selectedTemplate) {
      setError("Please go back and select a template");
      return;
    }
    setError(null);
    nextStep();
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Step 3 of 5: Select Guests
        </h2>
        <p style={{ color: "#999", fontSize: "14px" }}>
          Choose guests and review your selection before payment
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

      {/* SECTION 1: SELECTED TEMPLATE */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
          📋 Selected Template
        </h3>

        {selectedTemplate ? (
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
              {selectedTemplate.title}
            </p>
            <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              Message Type: {messageType === "image_and_text" ? "📋 Text + Image" : "📝 Text Only"}
            </p>
          </div>
        ) : (
          <div style={{ padding: "16px", color: "#999", textAlign: "center" }}>
            <p>No template selected. Please go back to Step 1.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: SELECT GUESTS */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>👥 Select Guests</h3>
          <span style={{ fontSize: "14px", color: "#999" }}>
            {selectedGuestIds.length} of {allGuests.length} selected
          </span>
        </div>

        {guestsLoading ? (
          <div style={{ padding: "24px", textAlign: "center", color: "#999" }}>
            <span style={{ marginRight: "8px" }}>⟳</span> Loading guests...
          </div>
        ) : guestsError || allGuests.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "#999" }}>
            No guests available.
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: "#999" }}>
                FILTER BY CATEGORY
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((category) => {
                  const categoryCount =
                    category === "all"
                      ? allGuests.length
                      : allGuests.filter((g: any) => g.category === category).length;
                  const isActive = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: isActive ? "linear-gradient(135deg, #e91e8c, #ff5252)" : "rgba(255,255,255,0.05)",
                        color: isActive ? "white" : "#999",
                      }}
                    >
                      {category === "all"
                        ? "All"
                        : category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      ({categoryCount})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select All Toggle */}
            <div
              style={{
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={
                    filteredGuests.length > 0 &&
                    filteredGuests.every((g: any) => selectedGuestIds.includes(g.id))
                  }
                  onChange={handleSelectAllInCategory}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                  Select all {selectedCategory === "all" ? "guests" : "in " + selectedCategory}
                </span>
              </label>
            </div>

            {/* Guest List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
              {filteredGuests.map((guest: any) => (
                <div
                  key={guest.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    borderRadius: "8px",
                    background: selectedGuestIds.includes(guest.id)
                      ? "rgba(233, 30, 140, 0.1)"
                      : "rgba(255,255,255,0.02)",
                    border: selectedGuestIds.includes(guest.id)
                      ? "1px solid rgba(233, 30, 140, 0.3)"
                      : "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedGuestIds.includes(guest.id)}
                    onChange={() => handleGuestToggle(guest.id)}
                    style={{ width: "16px", height: "16px", marginRight: "12px", cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                      {guest.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                      {guest.phone}
                      {guest.category && ` • ${guest.category}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* SECTION 3: SUMMARY */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(233, 30, 140, 0.1), rgba(255, 82, 82, 0.1))",
          border: "1px solid rgba(233, 30, 140, 0.2)",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>
          📋 Summary
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "6px" }}>Selected Guests</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
              {selectedGuestIds.length}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "6px" }}>Template</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
              {selectedTemplate?.title || "—"}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "6px" }}>Status</p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: selectedGuestIds.length > 0 && selectedTemplate ? "#4ade80" : "#fbbf24",
              }}
            >
              {selectedGuestIds.length > 0 && selectedTemplate ? "✓ Ready" : "⚠ Incomplete"}
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
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
          disabled={loading || guestsLoading || selectedGuestIds.length === 0 || !selectedTemplate}
          style={{
            marginLeft: "auto",
            padding: "14px 32px",
            borderRadius: "8px",
            border: "none",
            background:
              loading || guestsLoading || selectedGuestIds.length === 0 || !selectedTemplate
                ? "rgba(233, 30, 140, 0.5)"
                : "linear-gradient(135deg, #e91e8c, #ff5252)",
            color: "#fff",
            fontWeight: 700,
            cursor:
              loading || guestsLoading || selectedGuestIds.length === 0 || !selectedTemplate
                ? "not-allowed"
                : "pointer",
            opacity:
              loading || guestsLoading || selectedGuestIds.length === 0 || !selectedTemplate ? 0.6 : 1,
            transition: "all 0.2s",
            fontSize: "14px",
            boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (
              !loading &&
              !guestsLoading &&
              selectedGuestIds.length > 0 &&
              selectedTemplate
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
          {loading ? "⟳ Processing..." : "Continue to Review & Pay →"}
        </button>
      </div>
    </div>
  );
}