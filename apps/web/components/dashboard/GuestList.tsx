"use client";

import { useState } from "react";
import { Guest } from "@/types/guest";
import styles from "./guest-table.module.css";

export default function GuestTable({ data }: { data: Guest[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const guests = data || [];

  const filtered = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) || g.phone.includes(search);
    const matchFilter = filter === "all" || g.relation === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: guests.length,
    friend: guests.filter((g) => g.relation === "friend").length,
    family: guests.filter((g) => g.relation === "family").length,
    colleague: guests.filter((g) => g.relation === "colleague").length,
  };

  const relationColor = (r: string) =>
    ({
      friend: {
        bg: "rgba(59,130,246,0.12)",
        color: "rgba(147,197,253,0.8)",
        border: "rgba(59,130,246,0.2)",
      },
      family: {
        bg: "rgba(233,30,140,0.1)",
        color: "rgba(233,30,140,0.8)",
        border: "rgba(233,30,140,0.2)",
      },
      colleague: {
        bg: "rgba(245,158,11,0.1)",
        color: "rgba(251,191,36,0.8)",
        border: "rgba(245,158,11,0.2)",
      },
    })[r] || {
      bg: "rgba(255,255,255,0.05)",
      color: "rgba(245,240,255,0.5)",
      border: "rgba(255,255,255,0.1)",
    };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.title}>
            <span>📒</span> Contacts
            <span className={styles.total}>{guests.length} total</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className={styles.stats}>
          {[
            { key: "all", label: "All", icon: "👥" },
            { key: "friend", label: "Friends", icon: "😊" },
            { key: "family", label: "Family", icon: "❤️" },
            { key: "colleague", label: "Colleagues", icon: "💼" },
          ].map((t) => (
            <div
              key={t.key}
              className={`${styles.stat} ${filter === t.key ? styles.statActive : ""}`}
              onClick={() => setFilter(t.key)}
            >
              <span className={styles.statVal}>{counts[t.key as keyof typeof counts]}</span>
              {t.icon} {t.label}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.search}
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrap}>
        {guests.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>👤</div>
            <p>No contacts yet</p>
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
              {filtered.map((g, i) => {
                const rc = relationColor(g.relation);
                return (
                  <tr key={g.id} className={styles.row} style={{ animationDelay: `${i * 30}ms` }}>
                    <td className={styles.tdIndex}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className={styles.td}>
                      <div className={styles.name}>{g.name}</div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.phone}>{g.phone}</span>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={styles.badge}
                        style={{ background: rc.bg, color: rc.color, borderColor: rc.border }}
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