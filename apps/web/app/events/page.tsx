"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateEventModal from "@/components/CreateEvent/CreateEventModal";
import EventDetailsModal from "./EventDetailsModal";
import { useGetEventsQuery } from "@/store/apiSlice";
import styles from "./Events.module.css";

/**
 * Events Page Component
 * Displays user's events with delivery tracking and status
 * 
 * Features:
 * - List all events with statistics
 * - Real-time delivery tracking
 * - Event status indicators
 * - Create new events
 * - View event details
 */
export default function EventsPage() {
  // ==================== NAVIGATION & STATE ====================
  const params = useSearchParams();
  const templateId = params.get("templateId");

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // ==================== QUERIES ====================
  const { data, isLoading } = useGetEventsQuery();
  const events = data?.data || [];

  // ==================== EFFECTS ====================
  /**
   * Open create event modal if templateId is in URL
   */
  useEffect(() => {
    if (templateId) setOpen(true);
  }, [templateId]);

  // ==================== HELPERS ====================

  /**
   * Determine event status based on delivery progress
   */
  const getEventStatus = (event: any) => {
    const pending = event.totalGuests - event.sentCount - event.failedCount;

    if (pending > 0) {
      return {
        label: "In Progress",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.1)",
        border: "rgba(245,158,11,0.25)",
      };
    }

    if (event.failedCount > 0) {
      return {
        label: "Has Failures",
        color: "#f87171",
        bg: "rgba(248,113,113,0.1)",
        border: "rgba(248,113,113,0.25)",
      };
    }

    return {
      label: "Completed",
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.25)",
    };
  };

  /**
   * Get emoji icon based on event type
   */
  const getEventTypeIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || "";

    if (lowerType.includes("wedding")) return "💍";
    if (lowerType.includes("birthday")) return "🎂";
    if (lowerType.includes("business")) return "🏢";
    return "🎉";
  };

  /**
   * Calculate sent percentage
   */
  const getSentPercentage = (event: any) => {
    return event.totalGuests > 0
      ? Math.round((event.sentCount / event.totalGuests) * 100)
      : 0;
  };

  /**
   * Calculate pending count
   */
  const getPendingCount = (event: any) => {
    return event.totalGuests - event.sentCount - event.failedCount;
  };

  // ==================== STATISTICS ====================
  const statistics = [
    {
      label: "Total Events",
      value: events.length,
      isPink: false,
    },
    {
      label: "Total Guests",
      value: events.reduce((acc: number, event: any) => acc + event.totalGuests, 0),
      isPink: false,
    },
    {
      label: "Invites Sent",
      value: events.reduce((acc: number, event: any) => acc + event.sentCount, 0),
      isPink: true,
    },
    {
      label: "Failed",
      value: events.reduce((acc: number, event: any) => acc + event.failedCount, 0),
      isPink: false,
    },
  ];

  // ==================== RENDER ====================

  return (
    <>
      {/* Background blobs */}
      <div
        className={styles.blob}
        style={{
          width: 500,
          height: 500,
          left: "-10%",
          top: "-10%",
          background: "#e91e8c",
        }}
      />
      <div
        className={styles.blob}
        style={{
          width: 350,
          height: 350,
          right: "-8%",
          bottom: "10%",
          background: "#ff5252",
          animationDelay: "6s",
        }}
      />

      <div className={styles.page}>
        <div className={styles.inner}>
          {/* ========== TOP BAR ========== */}
          <div className={styles.topbar}>
            <div>
              <h1 className={styles.title}>
                Your <span className={styles.titleHighlight}>Events</span>
              </h1>
              <p className={styles.subtitle}>
                Manage and track all your invite campaigns
              </p>
            </div>
            <button className={styles.newBtn} onClick={() => setOpen(true)}>
              <span className={styles.newBtnIcon}>+</span>
              New Event
            </button>
          </div>

          {/* ========== STATISTICS ========== */}
          {!isLoading && (
            <div className={styles.stats}>
              {statistics.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div
                    className={`${styles.statValue} ${
                      stat.isPink ? styles.statValuePink : ""
                    }`}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========== LOADING STATE ========== */}
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              Loading events...
            </div>
          )}

          {/* ========== EMPTY STATE ========== */}
          {!isLoading && events.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📭</div>
              <h2 className={styles.emptyTitle}>No events yet</h2>
              <p className={styles.emptyText}>
                Create your first invite campaign. Pick a template, add guests, and send.
              </p>
              <button className={styles.emptyBtn} onClick={() => setOpen(true)}>
                🚀 Create First Event
              </button>
            </div>
          )}

          {/* ========== EVENTS GRID ========== */}
          {!isLoading && events.length > 0 && (
            <div className={styles.grid}>
              {events.map((event: any, index: number) => {
                const status = getEventStatus(event);
                const sentPct = getSentPercentage(event);
                const pending = getPendingCount(event);

                return (
                  <div
                    key={event.id}
                    className={styles.card}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Card header */}
                    <div className={styles.cardTop}>
                      <div className={styles.cardIcon}>
                        {getEventTypeIcon(event.eventType)}
                      </div>
                      <span
                        className={styles.statusBadge}
                        style={{
                          color: status.color,
                          background: status.bg,
                          borderColor: status.border,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Event info */}
                    <div className={styles.cardType}>{event.eventType}</div>
                    <div className={styles.cardTemplate}>
                      {event.templateName || "Custom Template"}
                    </div>

                    {/* Progress section */}
                    <div className={styles.progressLabel}>
                      <span>Delivery progress</span>
                      <span>{sentPct}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${sentPct}%` }}
                      />
                    </div>

                    {/* Status pills */}
                    <div className={styles.pills}>
                      <span className={`${styles.pill} ${styles.pillSent}`}>
                        ✓ {event.sentCount} sent
                      </span>

                      {event.failedCount > 0 && (
                        <span className={`${styles.pill} ${styles.pillFailed}`}>
                          ✕ {event.failedCount} failed
                        </span>
                      )}

                      {pending > 0 && (
                        <span className={`${styles.pill} ${styles.pillPending}`}>
                          ⏳ {pending} pending
                        </span>
                      )}

                      <span className={`${styles.pill} ${styles.pillDefault}`}>
                        👥 {event.totalGuests} total
                      </span>
                    </div>

                    {/* CTA button */}
                    <button
                      className={styles.cardBtn}
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========== MODALS ========== */}
      {selectedEvent && (
        <EventDetailsModal
          eventId={selectedEvent.id}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {open && (
        <CreateEventModal templateId={templateId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}