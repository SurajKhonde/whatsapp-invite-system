"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function GuestForm({ onSubmit }: { onSubmit: (g: { name: string; phone: string; relation: "friend" | "family" | "colleague" }) => void }) {
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("91");
  const [relation, setRelation] = useState<"friend" | "family" | "colleague">("friend");
  const [errors, setErrors]     = useState({ name: "", phone: "" });
  const [added, setAdded]       = useState(false);

  const validate = () => {
    const e = { name: "", phone: "" };
    let ok = true;
    if (!name.trim())        { e.name  = "Name is required";             ok = false; }
    if (phone.length < 10)   { e.phone = "Enter a valid phone number";   ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim(), phone: `+${phone}`, relation });
    setName(""); setPhone("91"); setRelation("friend");
    setErrors({ name: "", phone: "" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      <style>{`
        .gf-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 24px;
          backdrop-filter: blur(12px);
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }
        .gf-title {
          font-size: 15px;
          font-weight: 600;
          color: #e91e8c;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gf-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(245,240,255,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }
        .gf-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #f5f0ff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .gf-input::placeholder { color: rgba(245,240,255,0.25); }
        .gf-input:focus {
          border-color: rgba(233,30,140,0.5);
          box-shadow: 0 0 0 3px rgba(233,30,140,0.08);
        }
        .gf-input.err { border-color: rgba(239,68,68,0.6); }
        .gf-error { font-size: 11px; color: #f87171; margin-top: 4px; }

        .gf-select {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #f5f0ff;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e91e8c' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .gf-select option { background: #1a0d1f; color: #f5f0ff; }
        .gf-select:focus { border-color: rgba(233,30,140,0.5); }

        .gf-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #e91e8c, #ff5252);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(233,30,140,0.3);
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .gf-btn:hover  { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(233,30,140,0.45); }
        .gf-btn:active { transform: scale(0.98); }
        .gf-btn.success {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 20px rgba(16,185,129,0.3);
        }

        /* Override PhoneInput for dark theme */
        .gf-phone .react-tel-input .form-control {
          width: 100% !important;
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
          padding: 12px 16px 12px 52px !important;
          color: #f5f0ff !important;
          font-size: 14px !important;
          height: 46px !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .gf-phone .react-tel-input .form-control:focus {
          border-color: rgba(233,30,140,0.5) !important;
          box-shadow: 0 0 0 3px rgba(233,30,140,0.08) !important;
        }
        .gf-phone .react-tel-input .flag-dropdown {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-right: none !important;
          border-radius: 12px 0 0 12px !important;
        }
        .gf-phone .react-tel-input .selected-flag:hover,
        .gf-phone .react-tel-input .selected-flag:focus {
          background: rgba(233,30,140,0.1) !important;
        }
        .gf-phone .react-tel-input .country-list {
          background: #1a0d1f !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
        }
        .gf-phone .react-tel-input .country-list .country:hover {
          background: rgba(233,30,140,0.15) !important;
        }
        .gf-phone .react-tel-input .country-list .country-name { color: #f5f0ff !important; }
        .gf-phone .react-tel-input .country-list .dial-code { color: rgba(245,240,255,0.4) !important; }
        .gf-phone .react-tel-input .form-control.err {
          border-color: rgba(239,68,68,0.6) !important;
        }
        .gf-field { margin-bottom: 16px; }
      `}</style>

      <div className="gf-wrap">
        <div className="gf-title">
          <span>👤</span> Add Guest
        </div>

        {/* Name */}
        <div className="gf-field">
          <label className="gf-label">Full Name</label>
          <input
            value={name}
            onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
            placeholder="e.g. Priya Sharma"
            className={`gf-input ${errors.name ? "err" : ""}`}
          />
          {errors.name && <p className="gf-error">⚠ {errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="gf-field">
          <label className="gf-label">Phone Number</label>
          <div className="gf-phone">
            <PhoneInput
              country="in"
              value={phone}
              onChange={v => { setPhone(v); if (errors.phone) setErrors(p => ({ ...p, phone: "" })); }}
              inputClass={errors.phone ? "err" : ""}
            />
          </div>
          {errors.phone && <p className="gf-error">⚠ {errors.phone}</p>}
        </div>

        {/* Relation */}
        <div className="gf-field">
          <label className="gf-label">Relation</label>
          <select
  value={relation}
  onChange={(e) =>
    setRelation(e.target.value as "friend" | "family" | "colleague")
  }
>
            <option value="friend">👥 Friend</option>
            <option value="family">❤️ Family</option>
            <option value="colleague">💼 Colleague</option>
          </select>
        </div>

        {/* Button */}
        <button onClick={handleSubmit} className={`gf-btn ${added ? "success" : ""}`}>
          {added ? (<><span>✓</span> Guest Added!</>) : (<><span>+</span> Add to List</>)}
        </button>
      </div>
    </>
  );
}