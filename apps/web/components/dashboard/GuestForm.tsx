"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./guest-form.module.css";

export default function GuestForm({
  onSubmit,
}: {
  onSubmit: (g: {
    name: string;
    phone: string;
    relation: "friend" | "family" | "colleague";
  }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("91");
  const [relation, setRelation] = useState<"friend" | "family" | "colleague">("friend");
  const [errors, setErrors] = useState({ name: "", phone: "" });
  const [added, setAdded] = useState(false);

  const validate = () => {
    const e = { name: "", phone: "" };
    let ok = true;
    if (!name.trim()) {
      e.name = "Name is required";
      ok = false;
    }
    if (phone.length < 10) {
      e.phone = "Enter a valid phone number";
      ok = false;
    }
    setErrors(e);
    return ok;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim(), phone: `+${phone}`, relation });
    setName("");
    setPhone("91");
    setRelation("friend");
    setErrors({ name: "", phone: "" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        <span>👤</span> Add Guest
      </div>

      {/* Name */}
      <div className={styles.field}>
        <label className={styles.label}>Full Name</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((p) => ({ ...p, name: "" }));
          }}
          placeholder="e.g. Priya Sharma"
          className={`${styles.input} ${errors.name ? styles.inputErr : ""}`}
        />
        {errors.name && <p className={styles.error}>⚠ {errors.name}</p>}
      </div>

      {/* Phone */}
      <div className={styles.field}>
        <label className={styles.label}>Phone Number</label>
        <div className={styles.phone}>
          <PhoneInput
            country="in"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
            }}
            inputClass={errors.phone ? styles.phoneErr : ""}
          />
        </div>
        {errors.phone && <p className={styles.error}>⚠ {errors.phone}</p>}
      </div>

      {/* Relation */}
      <div className={styles.field}>
        <label className={styles.label}>Relation</label>
        <select
          value={relation}
          onChange={(e) => setRelation(e.target.value as "friend" | "family" | "colleague")}
          className={styles.select}
        >
          <option value="friend">👥 Friend</option>
          <option value="family">❤️ Family</option>
          <option value="colleague">💼 Colleague</option>
        </select>
      </div>

      {/* Button */}
      <button onClick={handleSubmit} className={`${styles.button} ${added ? styles.buttonSuccess : ""}`}>
        {added ? (
          <>
            <span>✓</span> Guest Added!
          </>
        ) : (
          <>
            <span>+</span> Add to List
          </>
        )}
      </button>
    </div>
  );
}