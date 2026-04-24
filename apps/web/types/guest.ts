export type Guest = {
  id?: string;      
  name: string;
  phone: string;
  relation?: string; 
  blocked?: boolean;
  inviteType ?: "marriage" | "baby" | "birthday";
  lastSentAt?: string;
  status?:string;
};

export interface GuestResponse {
  success: boolean;
  data: Guest[];
}