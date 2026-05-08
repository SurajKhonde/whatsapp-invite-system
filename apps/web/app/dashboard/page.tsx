"use client";

import { useState } from "react";
import GuestForm from "@/components/dashboard/GuestForm";
import DraftGuestList from "@/components/dashboard/DraftGuestList";
import GuestTable from "@/components/dashboard/GuestTable";
import { useAddGuestsMutation, useGetGuestsQuery } from "@/store/apiSlice";
import { GuestInput, Relation } from "@/types/guest";
import styles from "./Dashboard.module.css";


export default function Dashboard() {
  // ==================== STATE ====================
  const [draftGuests, setDraftGuests] = useState<GuestInput[]>([]);
  
  // ==================== QUERIES & MUTATIONS ====================
  const [addGuests, { isLoading: isSaving }] = useAddGuestsMutation();
  const { data: guestsData, isLoading: isFetching } = useGetGuestsQuery();
  const guests = guestsData?.data ?? [];

  // ==================== HANDLERS ====================

  /**
   * Add a guest to the draft list
   */
  const handleAddDraft = (guest: GuestInput) => {
    setDraftGuests((prev) => [...prev, guest]);
  };

  /**
   * Remove a guest from draft list by index
   */
  const handleRemove = (index: number) => {
    setDraftGuests((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Save all draft guests to database
   */
  const handleSaveAll = async () => {
    if (!draftGuests.length) return;
    try {
      await addGuests({ guests: draftGuests }).unwrap();
      setDraftGuests([]);
    } catch (error) {
      console.error("Error saving guests:", error);
    }
  };

  // ==================== STATISTICS ====================

  const statistics = [
    {
      label: "Total Contacts",
      value: guests.length,
      hint: "saved guests",
      isPink: false,
    },
    {
      label: "Family",
      value: guests.filter((g) => g.relation === "family").length,
      hint: "family members",
      isPink: true,
    },
    {
      label: "Friends",
      value: guests.filter((g) => g.relation === "friend").length,
      hint: "friends",
      isPink: false,
    },
    {
      label: "Colleagues",
      value: guests.filter((g) => g.relation === "colleague").length,
      hint: "colleagues",
      isPink: false,
    },
    {
      label: "Ready to Send",
      value: draftGuests.length,
      hint: "unsaved guests",
      isPink: draftGuests.length > 0,
    },
  ];

  // ==================== RENDER ====================

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ========== TOP BAR ========== */}
        <div className={styles.topbar}>
          <div>
            <div className={styles.greeting}>
              Your <span className={styles.greetingHighlight}>Contacts</span>
            </div>
            <div className={styles.sub}>
              Add and manage guests for your events
            </div>
          </div>
          <div className={styles.badge}>💌 Pilupoo Dashboard</div>
        </div>

        {/* ========== STATISTICS CARDS ========== */}
        <div className={styles.stats}>
          {statistics.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div
                className={`${styles.statValue} ${
                  stat.isPink ? styles.statValuePink : ""
                }`}
              >
                {stat.value}
              </div>
              <div className={styles.statHint}>{stat.hint}</div>
            </div>
          ))}
        </div>

        {/* ========== FORM + DRAFT GRID ========== */}
        <div className={styles.grid}>
          <GuestForm onSubmit={handleAddDraft} />
          <DraftGuestList
            guests={draftGuests}
            onRemove={handleRemove}
            onSaveAll={handleSaveAll}
            isLoading={isSaving}
          />
        </div>

        {/* ========== GUEST TABLE ========== */}
        <div className={styles.tableSection}>
          {isFetching ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              Loading contacts...
            </div>
          ) : (
            <GuestTable data={guests} />
          )}
        </div>
      </div>
    </div>
  );
}