"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateEventModal from "./CreateEventModal";
import EventDetailsModal from "./EventDetailsModal";
import { useGetEventsQuery } from "@/store/apiSlice";

export default function EventsPage() {
  const params     = useSearchParams();
  const templateId = params.get("templateId");

  const [open, setOpen]                   = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data, isLoading } = useGetEventsQuery();
  const events = data?.data || [];

  useEffect(() => { if (templateId) setOpen(true); }, [templateId]);

  // ── Status helpers ──────────────────────────────────────
  const getStatus = (e: any) => {
    const pending = e.totalGuests - e.sentCount - e.failedCount;
    if (pending > 0)       return { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)" };
    if (e.failedCount > 0) return { label: "Has Failures", color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" };
    return                        { label: "Completed",    color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)" };
  };

  const eventTypeIcon = (type: string) =>
    type?.toLowerCase().includes("wedding")  ? "💍" :
    type?.toLowerCase().includes("birthday") ? "🎂" :
    type?.toLowerCase().includes("business") ? "🏢" : "🎉";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ev-page {
          min-height: 100vh;
          background: #0d0810;
          color: #f5f0ff;
          font-family: 'DM Sans', sans-serif;
          padding: 36px 28px;
          position: relative;
          overflow-x: hidden;
        }

        /* background bubbles */
        .ev-page::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background-image: radial-gradient(circle, rgba(245,240,255,0.025) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }
        .ev-blob {
          position: fixed; border-radius: 50%;
          filter: blur(100px); opacity: 0.08;
          pointer-events: none; z-index: 0;
          animation: evFloat 18s ease-in-out infinite;
        }
        @keyframes evFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-30px) scale(1.05); }
        }

        .ev-inner { position: relative; z-index: 1; max-width: 1300px; margin: 0 auto; }

        /* Topbar */
        .ev-topbar {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 32px; gap: 16px; flex-wrap: wrap;
        }
        .ev-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800; line-height: 1.1;
        }
        .ev-title span { color: #e91e8c; }
        .ev-subtitle {
          font-size: 13px; color: rgba(245,240,255,0.35);
          margin-top: 4px;
        }
        .ev-new-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 20px rgba(233,30,140,0.3);
          white-space: nowrap;
        }
        .ev-new-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(233,30,140,0.45); }

        /* Stats row */
        .ev-stats {
          display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap;
        }
        .ev-stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 20px; flex: 1; min-width: 120px;
          transition: border-color 0.2s;
        }
        .ev-stat:hover { border-color: rgba(233,30,140,0.2); }
        .ev-stat-n {
          font-size: 26px; font-weight: 800; line-height: 1;
          color: #f5f0ff;
        }
        .ev-stat-n.pink { color: #e91e8c; }
        .ev-stat-l {
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(245,240,255,0.28);
          margin-bottom: 5px;
        }

        /* Loading */
        .ev-loading {
          display: flex; align-items: center; justify-content: center;
          height: 50vh; gap: 12px; color: rgba(245,240,255,0.25); font-size: 14px;
        }
        .ev-spinner {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(233,30,140,0.2);
          border-top-color: #e91e8c;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Empty state */
        .ev-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 55vh; text-align: center; gap: 14px;
        }
        .ev-empty-icon {
          font-size: 64px; opacity: 0.25;
          animation: evFloat 4s ease-in-out infinite;
        }
        .ev-empty h2 { font-size: 20px; font-weight: 700; color: rgba(245,240,255,0.6); }
        .ev-empty p  { font-size: 13px; color: rgba(245,240,255,0.3); max-width: 280px; line-height: 1.6; }
        .ev-empty-btn {
          padding: 12px 28px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 20px rgba(233,30,140,0.3);
          margin-top: 8px;
        }
        .ev-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(233,30,140,0.45); }

        /* Grid */
        .ev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        /* Event card */
        .ev-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 22px 20px;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          cursor: default;
          animation: cardIn 0.3s ease both;
        }
        .ev-card:hover {
          transform: translateY(-4px);
          border-color: rgba(233,30,140,0.25);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ev-card-top {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: 16px;
        }
        .ev-card-icon {
          width: 46px; height: 46px; border-radius: 12px;
          background: rgba(233,30,140,0.1);
          border: 1px solid rgba(233,30,140,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .ev-status-badge {
          font-size: 10px; font-weight: 600;
          padding: 4px 10px; border-radius: 100px;
          border: 1px solid; letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .ev-card-type {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(245,240,255,0.3);
          margin-bottom: 4px;
        }
        .ev-card-template {
          font-size: 16px; font-weight: 700; color: #f5f0ff;
          margin-bottom: 16px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Progress bar */
        .ev-progress-label {
          display: flex; justify-content: space-between;
          font-size: 11px; color: rgba(245,240,255,0.3);
          margin-bottom: 6px;
        }
        .ev-progress-track {
          height: 5px; background: rgba(255,255,255,0.08);
          border-radius: 100px; margin-bottom: 14px; overflow: hidden;
        }
        .ev-progress-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #e91e8c, #ff5252);
          transition: width 0.8s ease;
        }

        /* Pill stats */
        .ev-pills {
          display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;
        }
        .ev-pill {
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 100px; border: 1px solid;
        }
        .ev-pill-sent    { background: rgba(52,211,153,0.08); color: #34d399; border-color: rgba(52,211,153,0.2); }
        .ev-pill-failed  { background: rgba(248,113,113,0.08); color: #f87171; border-color: rgba(248,113,113,0.2); }
        .ev-pill-pending { background: rgba(251,191,36,0.08); color: #fbbf24; border-color: rgba(251,191,36,0.2); }

        .ev-card-btn {
          width: 100%; padding: 10px; border-radius: 10px; border: none;
          background: rgba(233,30,140,0.1);
          border: 1px solid rgba(233,30,140,0.2);
          color: #e91e8c; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.15s;
        }
        .ev-card-btn:hover {
          background: rgba(233,30,140,0.18);
          box-shadow: 0 4px 16px rgba(233,30,140,0.2);
        }
      `}</style>

      {/* Background blobs */}
      <div className="ev-blob" style={{ width:500, height:500, left:"-10%", top:"-10%", background:"#e91e8c" }} />
      <div className="ev-blob" style={{ width:350, height:350, right:"-8%", bottom:"10%", background:"#ff5252", animationDelay:"6s" }} />

      <div className="ev-page">
        <div className="ev-inner">

          {/* Topbar */}
          <div className="ev-topbar">
            <div>
              <h1 className="ev-title">Your <span>Events</span></h1>
              <p className="ev-subtitle">Manage and track all your invite campaigns</p>
            </div>
            <button className="ev-new-btn" onClick={() => setOpen(true)}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              New Event
            </button>
          </div>

          {/* Stats */}
          {!isLoading && (
            <div className="ev-stats">
              {[
                { label:"Total Events",   val: events.length,                                          pink: false },
                { label:"Total Guests",   val: events.reduce((a: number, e: any) => a + e.totalGuests, 0), pink: false },
                { label:"Invites Sent",   val: events.reduce((a: number, e: any) => a + e.sentCount, 0),   pink: true  },
                { label:"Failed",         val: events.reduce((a: number, e: any) => a + e.failedCount, 0), pink: false },
              ].map(s => (
                <div key={s.label} className="ev-stat">
                  <div className="ev-stat-l">{s.label}</div>
                  <div className={`ev-stat-n ${s.pink ? "pink" : ""}`}>{s.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="ev-loading">
              <div className="ev-spinner" />
              Loading events...
            </div>
          )}

          {/* Empty */}
          {!isLoading && events.length === 0 && (
            <div className="ev-empty">
              <div className="ev-empty-icon">📭</div>
              <h2>No events yet</h2>
              <p>Create your first invite campaign. Pick a template, add guests, and send.</p>
              <button className="ev-empty-btn" onClick={() => setOpen(true)}>
                🚀 Create First Event
              </button>
            </div>
          )}

          {/* Events grid */}
          {!isLoading && events.length > 0 && (
            <div className="ev-grid">
              {events.map((event: any, i: number) => {
                const status  = getStatus(event);
                const pending = event.totalGuests - event.sentCount - event.failedCount;
                const sentPct = event.totalGuests > 0
                  ? Math.round((event.sentCount / event.totalGuests) * 100)
                  : 0;

                return (
                  <div
                    key={event.id}
                    className="ev-card"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Card top row */}
                    <div className="ev-card-top">
                      <div className="ev-card-icon">
                        {eventTypeIcon(event.eventType)}
                      </div>
                      <span
                        className="ev-status-badge"
                        style={{ color: status.color, background: status.bg, borderColor: status.border }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Type + template */}
                    <div className="ev-card-type">{event.eventType}</div>
                    <div className="ev-card-template">
                      {event.templateName || "Custom Template"}
                    </div>

                    {/* Progress */}
                    <div className="ev-progress-label">
                      <span>Delivery progress</span>
                      <span>{sentPct}%</span>
                    </div>
                    <div className="ev-progress-track">
                      <div className="ev-progress-fill" style={{ width: `${sentPct}%` }} />
                    </div>

                    {/* Pills */}
                    <div className="ev-pills">
                      <span className="ev-pill ev-pill-sent">✓ {event.sentCount} sent</span>
                      {event.failedCount > 0 && (
                        <span className="ev-pill ev-pill-failed">✕ {event.failedCount} failed</span>
                      )}
                      {pending > 0 && (
                        <span className="ev-pill ev-pill-pending">⏳ {pending} pending</span>
                      )}
                      <span className="ev-pill" style={{ background:"rgba(255,255,255,0.04)", color:"rgba(245,240,255,0.35)", borderColor:"rgba(255,255,255,0.08)" }}>
                        👥 {event.totalGuests} total
                      </span>
                    </div>

                    {/* CTA */}
                    <button
                      className="ev-card-btn"
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

      {/* Modals */}
      {selectedEvent && (
        <EventDetailsModal
          eventId={selectedEvent.id}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {open && (
        <CreateEventModal
          templateId={templateId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}