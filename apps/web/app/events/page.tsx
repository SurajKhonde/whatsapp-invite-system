"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateEventModal from "./CreateEventModal";
import { useGetEventsQuery } from "@/store/apiSlice";
import EventDetailsModal from "./EventDetailsModal";
export default function EventsPage() {
  const params = useSearchParams();
  const templateId = params.get("templateId");

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data, isLoading } = useGetEventsQuery();

  const events = data?.data || [];

  useEffect(() => {
    if (templateId) setOpen(true);
  }, [templateId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 relative p-6">

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

      {/* 🎯 HEADER */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Your Events
      </h1>

      {/* 🔄 LOADING */}
      {isLoading && <p>Loading events...</p>}

      {/* 📭 EMPTY */}
      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No events yet 🚀
          </h2>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 px-8 py-3 rounded-full text-white
            bg-gradient-to-r from-pink-500 to-orange-500"
          >
            Create Event
          </button>
        </div>
      )}

      {/* 📦 EVENT LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: any) => (
          <div
            key={event.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {event.eventType} 🎉
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              Template: {event.templateName}
            </p>

            <div className="text-sm text-gray-600 mb-3">
              👥 {event.totalGuests} guests
            </div>

            <div className="flex gap-2 text-xs mb-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                Sent: {event.sentCount}
              </span>

              <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                Failed: {event.failedCount}
              </span>

              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                Pending: {event.totalGuests - event.sentCount - event.failedCount}
              </span>
            </div>

            <button
              onClick={() => setSelectedEvent(event)}
              className="w-full mt-2 bg-pink-500 py-2 rounded-lg hover:bg-gray-200 "
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* 🧾 EVENT DETAILS MODAL */}
      {selectedEvent && (
        <EventDetailsModal
          eventId={selectedEvent.id}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* CREATE MODAL */}
      {open && (
        <CreateEventModal
          templateId={templateId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}