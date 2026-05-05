export interface PreviewInviteDTO {
  templateName: string;
  groomName: string;
  brideName: string;
  day: string;
  monthYear: string;
  venueName: string;
  venueAddress: string;
}

export interface InviteTemplateData extends Record<string, string> {
  groomName: string;
  brideName: string;
  day: string;
  monthYear: string;
  venueName: string;
  venueAddress: string;
}