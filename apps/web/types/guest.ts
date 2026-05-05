// apps/web/types/guest.ts — REPLACE your existing file

// ── What frontend sends when adding a guest ──────────────
export type GuestInput = {
  name:     string;
  phone:    string;       // "+919876543210"
  relation: "friend" | "family" | "colleague";
};

// ── What DB returns after insert (safe — no real phone) ──
export type Guest = {
  id:          string;
  host_id:     string;
  name:        string;
  phone:       string;    // masked: "+91*****1234"
  relation:    string;
  phone_last4: string;
  created_at:  string;
};

// ── API response shapes ───────────────────────────────────
export type GuestResponse = {
  success: boolean;
  message: string;
  data:    Guest[];
};

// ── What addGuests mutation sends to backend ──────────────
export type AddGuestsRequest = {
  guests: GuestInput[];
};