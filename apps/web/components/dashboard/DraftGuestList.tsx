"use client";

import { GuestInput } from "@/types/guest";

type Props = {
  guests:    GuestInput[];
  onRemove:  (i: number) => void;
  onSaveAll: () => void;
  isLoading: boolean;
};

export default function DraftGuestList({ guests, onRemove, onSaveAll, isLoading }: Props) {
  return (
    <>
      <style>{`
        .dl-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 24px;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .dl-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .dl-title {
          font-size: 15px;
          font-weight: 600;
          color: #e91e8c;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dl-count {
          background: rgba(233,30,140,0.15);
          border: 1px solid rgba(233,30,140,0.25);
          color: #e91e8c;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 100px;
        }
        .dl-save-btn {
          padding: 9px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
          box-shadow: 0 4px 16px rgba(16,185,129,0.25);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dl-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(16,185,129,0.35); }
        .dl-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .dl-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: rgba(245,240,255,0.2);
          font-size: 13px;
        }
        .dl-empty-icon { font-size: 36px; opacity: 0.3; }

        .dl-list { flex: 1; overflow-y: auto; }
        .dl-list::-webkit-scrollbar { width: 3px; }
        .dl-list::-webkit-scrollbar-thumb { background: rgba(233,30,140,0.3); border-radius: 2px; }

        .dl-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.2s;
          animation: slideIn 0.2s ease;
        }
        .dl-item:hover { border-color: rgba(233,30,140,0.2); }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .dl-item-name {
          font-size: 14px;
          font-weight: 500;
          color: #f5f0ff;
          margin-bottom: 2px;
        }
        .dl-item-meta {
          font-size: 11px;
          color: rgba(245,240,255,0.35);
          display: flex;
          gap: 8px;
        }
        .dl-relation-badge {
          background: rgba(233,30,140,0.1);
          color: rgba(233,30,140,0.7);
          padding: 1px 7px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 500;
          text-transform: capitalize;
        }
        .dl-remove {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.15);
          color: rgba(239,68,68,0.6);
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .dl-remove:hover {
          background: rgba(239,68,68,0.2);
          color: #f87171;
          border-color: rgba(239,68,68,0.3);
        }

        .dl-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dl-footer-hint {
          font-size: 11px;
          color: rgba(245,240,255,0.25);
        }
      `}</style>

      <div className="dl-wrap">
        <div className="dl-header">
          <div className="dl-title">
            <span>📋</span>
            New Guests
            {guests.length > 0 && <span className="dl-count">{guests.length}</span>}
          </div>
          <button
            onClick={onSaveAll}
            disabled={guests.length === 0 || isLoading}
            className="dl-save-btn"
          >
            {isLoading ? (
              <><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Saving...</>
            ) : (
              <><span>💾</span> Save All</>
            )}
          </button>
        </div>

        {guests.length === 0 ? (
          <div className="dl-empty">
            <div className="dl-empty-icon">👥</div>
            <p>Add guests using the form</p>
            <p style={{ fontSize:11, opacity:0.6 }}>They'll appear here before saving</p>
          </div>
        ) : (
          <div className="dl-list">
            {guests.map((g, i) => (
              <div key={i} className="dl-item">
                <div>
                  <div className="dl-item-name">{g.name}</div>
                  <div className="dl-item-meta">
                    <span>{g.phone}</span>
                    <span className="dl-relation-badge">{g.relation}</span>
                  </div>
                </div>
                <button className="dl-remove" onClick={() => onRemove(i)}>✕ Remove</button>
              </div>
            ))}
          </div>
        )}

        {guests.length > 0 && (
          <div className="dl-footer">
            <span className="dl-footer-hint">
              {guests.length} guest{guests.length > 1 ? "s" : ""} ready to save
            </span>
            <span className="dl-footer-hint">Not saved yet ·</span>
          </div>
        )}
      </div>
    </>
  );
}