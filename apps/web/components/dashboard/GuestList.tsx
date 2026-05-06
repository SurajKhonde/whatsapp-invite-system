"use client";

import { useState } from "react";
import { Guest } from "@/types/guest";

export default function GuestTable({ data }: { data: Guest[] }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  const guests = data || [];

  const filtered = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                        g.phone.includes(search);
    const matchFilter = filter === "all" || g.relation === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:       guests.length,
    friend:    guests.filter(g => g.relation === "friend").length,
    family:    guests.filter(g => g.relation === "family").length,
    colleague: guests.filter(g => g.relation === "colleague").length,
  };

  const relationColor = (r: string) => ({
    friend:    { bg:"rgba(59,130,246,0.12)",   color:"rgba(147,197,253,0.8)",  border:"rgba(59,130,246,0.2)" },
    family:    { bg:"rgba(233,30,140,0.1)",     color:"rgba(233,30,140,0.8)",   border:"rgba(233,30,140,0.2)" },
    colleague: { bg:"rgba(245,158,11,0.1)",     color:"rgba(251,191,36,0.8)",   border:"rgba(245,158,11,0.2)" },
  }[r] || { bg:"rgba(255,255,255,0.05)", color:"rgba(245,240,255,0.5)", border:"rgba(255,255,255,0.1)" });

  return (
    <>
      <style>{`
        .gt-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .gt-header {
          padding: 22px 24px 0;
        }
        .gt-header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .gt-title {
          font-size: 15px;
          font-weight: 600;
          color: #e91e8c;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gt-total {
          font-size: 12px;
          color: rgba(245,240,255,0.3);
          font-weight: 400;
        }

        /* Stats row */
        .gt-stats {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .gt-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .gt-stat:hover { border-color: rgba(233,30,140,0.3); }
        .gt-stat.active {
          background: rgba(233,30,140,0.12);
          border-color: rgba(233,30,140,0.35);
          color: #e91e8c;
        }
        .gt-stat-val { font-weight: 700; color: #f5f0ff; margin-right: 4px; }
        .gt-stat.active .gt-stat-val { color: #e91e8c; }

        /* Search */
        .gt-search-wrap {
          position: relative;
          margin-bottom: 16px;
        }
        .gt-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(245,240,255,0.25);
          font-size: 14px;
          pointer-events: none;
        }
        .gt-search {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 14px 10px 38px;
          color: #f5f0ff;
          font-size: 13px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .gt-search::placeholder { color: rgba(245,240,255,0.2); }
        .gt-search:focus { border-color: rgba(233,30,140,0.4); }

        /* Table */
        .gt-table-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 0 24px 20px;
        }
        .gt-table-wrap::-webkit-scrollbar { width: 3px; }
        .gt-table-wrap::-webkit-scrollbar-thumb { background: rgba(233,30,140,0.3); border-radius: 2px; }

        .gt-table { width: 100%; border-collapse: separate; border-spacing: 0 4px; }

        .gt-th {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245,240,255,0.25);
          padding: 8px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          background: rgba(13,8,16,0.9);
          backdrop-filter: blur(8px);
          z-index: 1;
        }

        .gt-row {
          background: rgba(255,255,255,0.025);
          border-radius: 10px;
          transition: background 0.15s, transform 0.1s;
          animation: rowIn 0.2s ease both;
        }
        .gt-row:hover { background: rgba(233,30,140,0.06); transform: translateX(2px); }
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .gt-td {
          padding: 13px 12px;
          font-size: 13px;
          color: rgba(245,240,255,0.75);
        }
        .gt-td:first-child { border-radius: 10px 0 0 10px; padding-left: 16px; }
        .gt-td:last-child  { border-radius: 0 10px 10px 0; padding-right: 16px; }

        .gt-name { font-weight: 600; color: #f5f0ff; font-size: 14px; }
        .gt-phone { font-family: monospace; font-size: 12px; color: rgba(245,240,255,0.45); letter-spacing: 0.05em; }
        .gt-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 100px;
          text-transform: capitalize;
          letter-spacing: 0.04em;
          border: 1px solid;
        }

        .gt-empty {
          padding: 60px 24px;
          text-align: center;
          color: rgba(245,240,255,0.2);
        }
        .gt-empty-icon { font-size: 48px; opacity: 0.3; margin-bottom: 12px; }
        .gt-empty p { font-size: 14px; margin-bottom: 4px; }
        .gt-empty small { font-size: 12px; opacity: 0.6; }

        .gt-no-results {
          padding: 40px 24px;
          text-align: center;
          color: rgba(245,240,255,0.25);
          font-size: 13px;
        }
      `}</style>

      <div className="gt-wrap">
        <div className="gt-header">
          <div className="gt-header-top">
            <div className="gt-title">
              <span>📒</span> Contacts
              <span className="gt-total">{guests.length} total</span>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="gt-stats">
            {[
              { key:"all",       label:"All",        icon:"👥" },
              { key:"friend",    label:"Friends",    icon:"😊" },
              { key:"family",    label:"Family",     icon:"❤️" },
              { key:"colleague", label:"Colleagues", icon:"💼" },
            ].map(t => (
              <div
                key={t.key}
                className={`gt-stat ${filter === t.key ? "active" : ""}`}
                onClick={() => setFilter(t.key)}
              >
                <span className="gt-stat-val">{counts[t.key as keyof typeof counts]}</span>
                {t.icon} {t.label}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="gt-search-wrap">
            <span className="gt-search-icon">🔍</span>
            <input
              className="gt-search"
              placeholder="Search by name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="gt-table-wrap">
          {guests.length === 0 ? (
            <div className="gt-empty">
              <div className="gt-empty-icon">👤</div>
              <p>No contacts yet</p>
              <small>Add guests using the form above</small>
            </div>
          ) : filtered.length === 0 ? (
            <div className="gt-no-results">
              No results for "{search}"
            </div>
          ) : (
            <table className="gt-table">
              <thead>
                <tr>
                  <th className="gt-th">#</th>
                  <th className="gt-th">Name</th>
                  <th className="gt-th">Phone</th>
                  <th className="gt-th">Relation</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => {
                  const rc = relationColor(g.relation);
                  return (
                    <tr key={g.id} className="gt-row" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="gt-td" style={{ color:"rgba(245,240,255,0.2)", fontSize:11, fontWeight:600 }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="gt-td">
                        <div className="gt-name">{g.name}</div>
                      </td>
                      <td className="gt-td">
                        <span className="gt-phone">{g.phone}</span>
                      </td>
                      <td className="gt-td">
                        <span className="gt-badge" style={{ background: rc.bg, color: rc.color, borderColor: rc.border }}>
                          {g.relation}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}