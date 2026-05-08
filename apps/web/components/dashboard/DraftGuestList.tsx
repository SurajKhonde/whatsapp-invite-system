"use client";

import { GuestInput } from "@/types/guest";
import styles from "./draft-guest-list.module.css";

type Props = {
  guests: GuestInput[];
  onRemove: (i: number) => void;
  onSaveAll: () => void;
  isLoading: boolean;
};

export default function DraftGuestList({ guests, onRemove, onSaveAll, isLoading }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>📋</span>
          New Guests
          {guests.length > 0 && <span className={styles.count}>{guests.length}</span>}
        </div>
        <button
          onClick={onSaveAll}
          disabled={guests.length === 0 || isLoading}
          className={styles.saveBtn}
        >
          {isLoading ? (
            <>
              <span className={styles.spin}>⟳</span>
              Saving...
            </>
          ) : (
            <>
              <span>💾</span> Save All
            </>
          )}
        </button>
      </div>

      {guests.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👥</div>
          <p>Add guests using the form</p>
          <p className={styles.emptyHint}>They'll appear here before saving</p>
        </div>
      ) : (
        <div className={styles.list}>
          {guests.map((g, i) => (
            <div key={i} className={styles.item}>
              <div>
                <div className={styles.itemName}>{g.name}</div>
                <div className={styles.itemMeta}>
                  <span>{g.phone}</span>
                  <span className={styles.relationBadge}>{g.relation}</span>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => onRemove(i)}>
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {guests.length > 0 && (
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            {guests.length} guest{guests.length > 1 ? "s" : ""} ready to save
          </span>
          <span className={styles.footerHint}>Not saved yet ·</span>
        </div>
      )}
    </div>
  );
}