"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateEventModal from "./CreateEventModal";

export default function EventsPage() {
  const params = useSearchParams();
  const templateId = params.get("templateId");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (templateId) setOpen(true);
  }, [templateId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 relative">

      {/* 🔝 TOP RIGHT BUTTON */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-2 rounded-full text-white font-medium
          bg-gradient-to-r from-pink-500 to-orange-500
          shadow-md hover:shadow-xl hover:scale-105 transition"
        >
          + New Event
        </button>
      </div>

      {/* 🎯 CENTER EMPTY STATE */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          No events yet 🚀
        </h2>

        <p className="text-gray-500 mb-6">
          Create your first event and start sending invites
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-8 py-3 rounded-full text-white text-lg font-medium
          bg-gradient-to-r from-pink-500 to-orange-500
          shadow-lg hover:shadow-2xl hover:scale-105 transition"
        >
          Create Event
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <CreateEventModal
          templateId={templateId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}