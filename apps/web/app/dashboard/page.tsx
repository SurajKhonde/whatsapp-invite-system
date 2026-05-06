"use client";

import { useState }        from "react";
import GuestForm           from "@/components/dashboard/GuestForm";
import DraftGuestList      from "@/components/dashboard/DraftGuestList";
import GuestTable          from "@/components/dashboard/GuestTable";
import { useAddGuestsMutation, useGetGuestsQuery } from "@/store/apiSlice";
import { GuestInput,Relation }      from "@/types/guest";

export default function Dashboard() {
  const [draftGuests, setDraftGuests] = useState<GuestInput[]>([]);
  const [addGuests, { isLoading: isSaving }] = useAddGuestsMutation();
  const { data: guestsData, isLoading: isFetching } = useGetGuestsQuery();
  const guests = guestsData?.data ?? [];

 const handleAddDraft = (guest: GuestInput) => {
    setDraftGuests((prev) => [...prev, guest]);
  };
  const handleRemove    = (i: number) => setDraftGuests(p => p.filter((_, j) => j !== i));
  const handleSaveAll   = async () => {
    if (!draftGuests.length) return;
    try {
      await addGuests({ guests: draftGuests }).unwrap();
      setDraftGuests([]);
    } catch (e) { console.error(e); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .db-page {
          min-height: 100vh;
          background: #0d0810;
          background-image:
            radial-gradient(ellipse at 20% 20%, rgba(233,30,140,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(255,82,82,0.04) 0%, transparent 50%);
          padding: 28px 24px;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }

        /* Dot grid */
        .db-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(245,240,255,0.025) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .db-inner { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; }

        /* Top bar */
        .db-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .db-greeting {
          font-size: 22px;
          font-weight: 700;
          color: #f5f0ff;
        }
        .db-greeting span { color: #e91e8c; }
        .db-sub {
          font-size: 13px;
          color: rgba(245,240,255,0.35);
          margin-top: 2px;
        }
        .db-badge {
          background: rgba(233,30,140,0.1);
          border: 1px solid rgba(233,30,140,0.2);
          color: #e91e8c;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 16px;
          border-radius: 100px;
        }

        /* Stats strip */
        .db-stats {
          display: flex;
          gap: 14px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .db-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 20px;
          min-width: 140px;
          flex: 1;
          transition: border-color 0.2s;
        }
        .db-stat-card:hover { border-color: rgba(233,30,140,0.25); }
        .db-stat-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245,240,255,0.3);
          margin-bottom: 6px;
        }
        .db-stat-val {
          font-size: 26px;
          font-weight: 800;
          color: #f5f0ff;
          line-height: 1;
        }
        .db-stat-val.pink { color: #e91e8c; }
        .db-stat-hint {
          font-size: 11px;
          color: rgba(245,240,255,0.25);
          margin-top: 3px;
        }

        /* Main grid */
        .db-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 900px) {
          .db-grid { grid-template-columns: 1fr; }
        }

        /* Table section */
        .db-table-section { margin-top: 0; }

        .db-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: rgba(245,240,255,0.2);
          font-size: 14px;
          gap: 10px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .db-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(233,30,140,0.2);
          border-top-color: #e91e8c;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div className="db-page">
        <div className="db-inner">

          {/* Top bar */}
          <div className="db-topbar">
            <div>
              <div className="db-greeting">
                Your <span>Contacts</span>
              </div>
              <div className="db-sub">Add and manage guests for your events</div>
            </div>
            <div className="db-badge">
              💌 Pilupoo Dashboard
            </div>
          </div>

          {/* Stats strip */}
          <div className="db-stats">
            {[
              { label:"Total Contacts",  val: guests.length,                                               hint:"saved guests",   pink: false },
              { label:"Family",          val: guests.filter(g => g.relation === "family").length,          hint:"family members", pink: true  },
              { label:"Friends",         val: guests.filter(g => g.relation === "friend").length,          hint:"friends",        pink: false },
              { label:"Colleagues",      val: guests.filter(g => g.relation === "colleague").length,       hint:"colleagues",     pink: false },
              { label:"Ready to Send",   val: draftGuests.length,                                          hint:"unsaved guests", pink: draftGuests.length > 0 },
            ].map(s => (
              <div key={s.label} className="db-stat-card">
                <div className="db-stat-label">{s.label}</div>
                <div className={`db-stat-val ${s.pink ? "pink" : ""}`}>{s.val}</div>
                <div className="db-stat-hint">{s.hint}</div>
              </div>
            ))}
          </div>

          {/* Form + Draft side by side */}
          <div className="db-grid">
            <GuestForm onSubmit={handleAddDraft} />
            <DraftGuestList
              guests={draftGuests}
              onRemove={handleRemove}
              onSaveAll={handleSaveAll}
              isLoading={isSaving}
            />
          </div>

          {/* Guest table */}
          <div className="db-table-section">
            {isFetching ? (
              <div className="db-loading">
                <div className="db-spinner" />
                Loading contacts...
              </div>
            ) : (
              <GuestTable data={guests} />
            )}
          </div>

        </div>
      </div>
    </>
  );
}