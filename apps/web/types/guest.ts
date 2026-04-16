// types/guest.ts

export type Guest = {
  id?: string;          // 🔥 add id (important for future DB)
  name: string;
  phone: string;
  relation?: string;   // 🔥 optional relation
  blocked?: boolean;
  inviteType ?: "marriage" | "baby" | "birthday";
  lastSentAt?: string; // optional
  status?:string;
};