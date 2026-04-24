// src/modules/invite/invite.types.ts

export interface InviteTemplateData {
  [key: string]: string; // ✅ FIX for Record<string, string>

  name: string;
  date: string;
  time: string;
  venue: string;

  bgImage: string;
  ribbonImage: string;
  balloonImage: string;
  candleImage: string;
}

export interface PreviewInviteDTO {
  name: string;
  date: string;
  time: string;
  venue: string;
}