"use client";

import { useState } from "react";
import GuestForm from "@/components/dashboard/GuestForm";
import DraftGuestList from "@/components/dashboard/DraftGuestList";
import GuestTable from "@/components/dashboard/GuestTable";

import {
  useAddGuestsMutation,
  useGetGuestsQuery,
} from "@/store/apiSlice";

export default function Dashboard() {
  const [draftGuests, setDraftGuests] = useState<any[]>([]);
  const [addGuests, { isLoading: isSaving }] = useAddGuestsMutation();
  const { data: guests = [], isLoading: isFetching } =
    useGetGuestsQuery();

  // add draft
  const handleAddDraft = (guest: any) => {
    setDraftGuests((prev) => [...prev, guest]);
  };

  // remove draft
  const handleRemoveDraft = (index: number) => {
    setDraftGuests((prev) => prev.filter((_, i) => i !== index));
  };

  // save all
  const handleSaveAll = async () => {
    if (draftGuests.length === 0) return;

    try {
      await addGuests(draftGuests).unwrap();
      setDraftGuests([]); // clear draft
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      {/* TOP */}
      <div className="grid grid-cols-2 gap-6 p-6">

        <GuestForm onSubmit={handleAddDraft} />

        <DraftGuestList
          guests={draftGuests}
          onRemove={handleRemoveDraft}
          onSaveAll={handleSaveAll}
          isLoading={isSaving}
        />

      </div>

      {/* BOTTOM TABLE */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">

        {isFetching ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading guests...
          </div>
        ) : (
          <GuestTable data={guests} />
        )}

      </div>
    </div>
  );
}