"use client";

import { useState } from "react";
import styles from "./guest-table.module.css";

const RELATION_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  family:    { bg: "rgba(233,30,140,0.1)",  border: "rgba(233,30,140,0.35)",  color: "#e91e8c" },
  friend:    { bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.35)",  color: "#818cf8" },
  colleague: { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.35)",   color: "#4ade80" },
  other:     { bg: "rgba(245,240,255,0.06)", border: "rgba(245,240,255,0.15)", color: "rgba(245,240,255,0.5)" },
};

function getColor(relation: string) {
  return RELATION_COLORS[relation?.toLowerCase()] ?? RELATION_COLORS.other;
}

const FILTERS = ["all", "family", "friend", "colleague"];

export default function GuestTable({ data }: any) {
  const guests = data || [];
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = guests.filter((g: any) => {
    const matchFilter = activeFilter === "all" || g.relation?.toLowerCase() === activeFilter;
    const matchSearch =
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.phone?.includes(search);
    return matchFilter && matchSearch;
  });

  const countFor = (rel: string) =>
    rel === "all"
      ? guests.length
      : guests.filter((g: any) => g.relation?.toLowerCase() === rel).length;

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>
            👥 Contacts
            <span className={styles.total}>({guests.length})</span>
          </h2>
        </div>

        {/* Filter stats */}
        <div className={styles.stats}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.stat} ${activeFilter === f ? styles.statActive : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              <span className={styles.statVal}>{countFor(f)}</span>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.search}
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {guests.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>👤</div>
            <p>No contacts saved yet</p>
            <small>Add guests using the form above</small>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.noResults}>No results for "{search}"</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Phone</th>
                <th className={styles.th}>Relation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g: any, i: number) => {
                const c = getColor(g.relation);
                return (
                  <tr key={i} className={styles.row}>
                    <td className={styles.tdIndex}>{i + 1}</td>
                    <td className={styles.td}>
                      <span className={styles.name}>{g.name}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.phone}>{g.phone}</span>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={styles.badge}
                        style={{ background: c.bg, borderColor: c.border, color: c.color }}
                      >
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
  );
}