"use client";

import { useGetGuestsQuery, useGetTemplatesQuery, useCreateEventMutation } from "@/store/apiSlice";
import { useEffect, useState } from "react";

type Props = {
  templateId: string | null;
  onClose: () => void;
};

export default function CreateEventModal({ templateId, onClose }: Props) {
  const { data: guestData, isLoading } = useGetGuestsQuery();
  const { data: templateData } = useGetTemplatesQuery();

  const [createEvent, { isLoading: creating }] = useCreateEventMutation();

  const guests = guestData?.data || [];
  const templates = templateData?.data || [];

  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [eventType, setEventType] = useState("birthday");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(templateId);

  // 🔥 auto set template from URL
  useEffect(() => {
    if (templateId) {
      setSelectedTemplate(templateId);
    }
  }, [templateId]);

  const toggleGuest = (id: string) => {
    setSelectedGuests((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id]
    );
  };

  async function handleClick() {
    if (!selectedTemplate) {
      alert("Please select a template");
      return;
    }

    if (selectedGuests.length === 0) {
      alert("Select at least one guest");
      return;
    }

    try {
      await createEvent({
        templateId: selectedTemplate,
        eventType,
        guests: selectedGuests,
      }).unwrap();

      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  const selectedTemplateName =
    templates.find((t: any) => t.id === selectedTemplate)?.title;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[520px] p-6 rounded-2xl shadow-2xl animate-scaleIn">

        {/* HEADER */}
        <h2 className="text-xl font-bold mb-4 text-black">Create Event</h2>

        {/* EVENT TYPE */}
        <select
          className="w-full border rounded-lg p-2 mb-4 text-black"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="birthday">Birthday</option>
          <option value="wedding">Wedding</option>
          <option value="business">Business</option>
        </select>

        {/* TEMPLATE */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Select Template</p>

          {!templateId ? (
            <select
              className="w-full border rounded-lg p-2 text-black"
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
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-sm text-gray-800 font-medium">
              🎉 {selectedTemplateName || "Loading..."}
            </div>
          )}
        </div>

        {/* GUEST LIST */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Select Guests</p>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {isLoading && <p>Loading guests...</p>}

            {guests.map((g: any) => (
              <label
                key={g.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-pink-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium text-black">{g.name}</p>
                  <p className="text-sm text-gray-500">{g.phone}</p>
                </div>

                <input
                  type="checkbox"
                  className="accent-pink-500"
                  checked={selectedGuests.includes(g.id)}
                  onChange={() => toggleGuest(g.id)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={creating}
            onClick={handleClick}
            className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:scale-105 transition disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease;
        }
      `}</style>
    </div>
  );
}