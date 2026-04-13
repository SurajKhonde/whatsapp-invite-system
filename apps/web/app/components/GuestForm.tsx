"use client";

import { useState } from "react";

type Guest = {
  name: string;
  phone: string;
};

type Props = {
  onAdd: (guest: Guest) => void;
};

export default function GuestForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !phone) return;

    onAdd({ name, phone });

    setName("");
    setPhone("");
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="border p-2 flex-1 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 flex-1 rounded"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 rounded"
      >
        Add
      </button>
    </div>
  );
}