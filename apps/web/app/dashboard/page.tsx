"use client";

import { useState } from "react";
import GuestForm from "@/components/dashboard/GuestForm";
import DraftGuestList from "@/components/dashboard/DraftGuestList";
import GuestTable from "@/components/dashboard/GuestTable";
import { useAddGuestsMutation, useGetGuestsQuery } from "@/store/apiSlice";
import { GuestInput, Relation } from "@/types/guest";
import VerificationBanner from "@/components/VerificationBanner-Simple";

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
    <div className="dashboardPage">
      <VerificationBanner />
      <div className="dashboardInner">
        {/* ========== TOP BAR ========== */}
        <div className="dashboardTopbar">
          <div>
            <div className="dashboardGreeting">
              Your <span className="dashboardGreetingHighlight">Contacts</span>
            </div>
            <div className="dashboardSub">
              Add and manage guests for your events
            </div>
          </div>
          <div className="dashboardBadge">💌 పlooopu Dashboard</div>
        </div>

        {/* ========== STATISTICS CARDS ========== */}
        <div className="dashboardStats">
          {statistics.map((stat) => (
            <div key={stat.label} className="dashboardStatCard">
              <div className="dashboardStatLabel">{stat.label}</div>
              <div
                className={`dashboardStatValue ${
                  stat.isPink ? "dashboardStatValuePink" : ""
                }`}
              >
                {stat.value}
              </div>
              <div className="dashboardStatHint">{stat.hint}</div>
            </div>
          ))}
        </div>

        {/* ========== FORM + DRAFT GRID ========== */}
        <div className="dashboardGrid">
          <GuestForm onSubmit={handleAddDraft} />
          <DraftGuestList
            guests={draftGuests}
            onRemove={handleRemove}
            onSaveAll={handleSaveAll}
            isLoading={isSaving}
          />
        </div>

        {/* ========== GUEST TABLE / EMPTY STATE ========== */}
        <div className="dashboardTableSection">
          {isFetching ? (
            <div className="dashboardLoading">
              <div className="dashboardSpinner" />
              Loading contacts...
            </div>
          ) : guests.length > 0 ? (
            <GuestTable data={guests} />
          ) : (
            /* BEAUTIFUL EMPTY STATE */
            <div className="emptyStateContainer">
              <div className="emptyStateIcon">📇</div>
              <h2 className="emptyStateTitle">No Contacts Yet</h2>
              <p className="emptyStateSubtitle">
                Start adding guests to build your contact list. Add them one by one or in batches.
              </p>

              <div className="emptyStateSteps">
                <div className="emptyStateStep">
                  <div className="emptyStateStepNumber">1</div>
                  <span className="emptyStateStepText">Fill in guest details on the left</span>
                </div>
                <div className="emptyStateStep">
                  <div className="emptyStateStepNumber">2</div>
                  <span className="emptyStateStepText">Add them to your draft list</span>
                </div>
                <div className="emptyStateStep">
                  <div className="emptyStateStepNumber">3</div>
                  <span className="emptyStateStepText">Click "Save All" to store contacts</span>
                </div>
              </div>

              <div className="emptyStateHint">
                <span className="emptyStateHintIcon">💡</span>
                You can add as many guests as you want. They'll appear in this table once saved.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}