// 🔹 Base Event (list view)
export type Event = {
  id: string;
  eventType: string;
  templateName: string;
  totalGuests: number;
  sentCount: number;
  failedCount: number;
  status: "draft" | "processing" | "completed";
  createdAt: string; // ISO string
};

// 🔹 Get Events API
export type GetEventsResponse = {
  success: boolean;
  data: Event[];
};

// 🔹 Guest inside event (details view)
export type EventGuest = {
  id: string;
  name: string;
  phone: string;
  status: "sent" | "failed" | "pending";
};

// 🔹 Event Details API
export type EventDetailsResponse = {
  success: boolean;
  data: {
    event: Event;
    guests: EventGuest[];
  };
};

// 🔹 Create Event Request
export type CreateEventRequest = {
  templateId: string;
  eventType: string;
  guests: string[]; // guestIds
};

// 🔹 Create Event Response
export type CreateEventResponse = {
  success: boolean;
  data: {
    id: string;
  };
};