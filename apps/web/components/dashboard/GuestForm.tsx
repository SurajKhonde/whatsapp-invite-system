"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function GuestForm({ onSubmit }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("friend");

  const handleSubmit = () => {
    if (!name.trim() || !phone) return;

    onSubmit({
      name: name.trim(),
      phone,
      relation,
    });

    setName("");
    setPhone("");
    setRelation("friend");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-pink-100">

      <h2 className="text-lg font-semibold text-pink-600 mb-4">
        Add Guest
      </h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="w-full mb-3 px-3 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none text-black"
      />

      <div className="mb-3">
        <PhoneInput
          country={"in"}
          value={phone}
          onChange={(value) => setPhone(value)}
          inputStyle={{
            width: "100%",
            height: "48px",
            color: "#000",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid #fbcfe8",
          }}
        />
      </div>

      <select
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
        className="w-full mb-4 px-3 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none text-black"
      >
        <option value="friend">Friend</option>
        <option value="family">Family</option>
        <option value="colleague">Colleague</option>
      </select>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white shadow hover:scale-[1.02]"
      >
        Add Guest
      </button>
    </div>
  );
}