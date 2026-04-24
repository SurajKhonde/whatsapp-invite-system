"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function GuestForm({ onSubmit }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("91"); // ✅ default India
  const [relation, setRelation] = useState("friend");

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", phone: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!phone || phone.length < 10) {
      newErrors.phone = "Valid phone number required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      phone: `+${phone}`,
      relation,
    });

    // reset
    setName("");
    setPhone("91");
    setRelation("friend");
    setErrors({ name: "", phone: "" });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-pink-100">
      <h2 className="text-lg font-semibold text-pink-600 mb-4">
        Add Guest
      </h2>

      {/* NAME */}
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors({ ...errors, name: "" });
        }}
        placeholder="Full Name"
        className={`w-full mb-1 px-3 py-3 rounded-xl border outline-none text-black
          ${errors.name ? "border-red-500" : "border-pink-200"}
        `}
      />
      {errors.name && (
        <p className="text-red-500 text-xs mb-3">{errors.name}</p>
      )}

      {/* PHONE */}
      <div className="mb-1">
        <PhoneInput
          country={"in"}
          value={phone}
          onChange={(value) => {
            setPhone(value);
            if (errors.phone) setErrors({ ...errors, phone: "" });
          }}
          inputStyle={{
            width: "100%",
            height: "48px",
            color: "#000",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: errors.phone
              ? "1px solid red"
              : "1px solid #fbcfe8",
          }}
        />
      </div>
      {errors.phone && (
        <p className="text-red-500 text-xs mb-3">{errors.phone}</p>
      )}

      {/* RELATION */}
      <select
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
        className="w-full mb-4 px-3 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none text-black"
      >
        <option value="friend">Friend</option>
        <option value="family">Family</option>
        <option value="colleague">Colleague</option>
      </select>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white shadow hover:scale-[1.02]"
      >
        Add Guest
      </button>
    </div>
  );
}