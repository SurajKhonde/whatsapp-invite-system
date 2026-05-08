import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventDetails {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
}

interface ImageGeneration {
  jobId: string | null;
  status: "idle" | "loading" | "completed" | "failed";
  imageUrl: string | null;
  error: string | null;
}

interface CreateEventState {
  // Step 1
  selectedTemplate: {
    id: string;
    name: string;
    category: string;
  } | null;

  // Step 2
  eventDetails: EventDetails;
  messageType: "text_only" | "image_only" | "image_and_text";
  imageGeneration: ImageGeneration;

  // Step 3
  selectedGuests: string[]; // guest IDs
  whatsappTemplateId: string | null;

  // Step 4
  pricing: {
    baseCost: number;
    perGuestCost: number;
    totalGuests: number;
    profit: number;
    total: number;
  };
  paymentId: string | null;

  // Sending
  eventId: string | null;
  sending: {
    status: "idle" | "sending" | "completed";
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
    pendingCount: number;
  };

  // UI
  currentStep: 1 | 2 | 3 | 4 | 5;
  loading: boolean;
  error: string | null;
}

const initialState: CreateEventState = {
  selectedTemplate: null,
  eventDetails: {
    groomName: "",
    brideName: "",
    eventDate: "",
    eventTime: "",
    venueName: "",
    venueAddress: "",
  },
  messageType: "text_only",
  imageGeneration: {
    jobId: null,
    status: "idle",
    imageUrl: null,
    error: null,
  },
  selectedGuests: [],
  whatsappTemplateId: null,
  pricing: {
    baseCost: 100,
    perGuestCost: 1,
    totalGuests: 0,
    profit: 0,
    total: 0,
  },
  paymentId: null,
  eventId: null,
  sending: {
    status: "idle",
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    pendingCount: 0,
  },
  currentStep: 1,
  loading: false,
  error: null,
};

const createEventSlice = createSlice({
  name: "createEvent",
  initialState,
  reducers: {
    // Step 1: Select Template
    selectTemplate: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        category: string;
      }>
    ) => {
      state.selectedTemplate = action.payload;
    },

    // Step 2: Update Event Details
    updateEventDetails: (state, action: PayloadAction<Partial<EventDetails>>) => {
      state.eventDetails = { ...state.eventDetails, ...action.payload };
    },

    // Step 2: Select Message Type
    selectMessageType: (
      state,
      action: PayloadAction<"text_only" | "image_only" | "image_and_text">
    ) => {
      state.messageType = action.payload;
    },

    // Step 2: Start Image Generation
    startImageGeneration: (state, action: PayloadAction<string>) => {
      state.imageGeneration.status = "loading";
      state.imageGeneration.jobId = action.payload;
      state.imageGeneration.error = null;
    },

    // Step 2: Image Generation Completed
    imageGenerationSuccess: (state, action: PayloadAction<string>) => {
      state.imageGeneration.status = "completed";
      state.imageGeneration.imageUrl = action.payload;
      state.imageGeneration.error = null;
    },

    // Step 2: Image Generation Failed
    imageGenerationFailed: (state, action: PayloadAction<string>) => {
      state.imageGeneration.status = "failed";
      state.imageGeneration.error = action.payload;
    },

    // Step 3: Select Guests
    selectGuests: (state, action: PayloadAction<string[]>) => {
      state.selectedGuests = action.payload;
      // Recalculate pricing
      const totalGuests = action.payload.length;
      state.pricing.totalGuests = totalGuests;
      state.pricing.profit = Math.floor(
        (state.pricing.baseCost + state.pricing.perGuestCost * totalGuests) * 0.2
      );
      state.pricing.total =
        state.pricing.baseCost + state.pricing.perGuestCost * totalGuests + state.pricing.profit;
    },

    // Step 3: Select WhatsApp Template
    selectWhatsappTemplate: (state, action: PayloadAction<string>) => {
      state.whatsappTemplateId = action.payload;
    },

    // Step 4: Payment Success
    paymentSuccess: (state, action: PayloadAction<string>) => {
      state.paymentId = action.payload;
    },

    // After Payment: Event Created
    eventCreated: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
      state.currentStep = 5; // Go to Tracking
      state.sending.status = "sending";
    },

    // Step 5: Update Sending Status
    updateSendingStatus: (
      state,
      action: PayloadAction<{
        sentCount: number;
        deliveredCount: number;
        readCount: number;
        failedCount: number;
        pendingCount: number;
      }>
    ) => {
      state.sending = { ...state.sending, ...action.payload };
    },

    // Step 5: Sending Completed
    sendingCompleted: (state) => {
      state.sending.status = "completed";
    },

    // Navigation
    goToStep: (state, action: PayloadAction<1 | 2 | 3 | 4 | 5>) => {
      state.currentStep = action.payload;
    },

    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep = (state.currentStep + 1) as 1 | 2 | 3 | 4 | 5;
      }
    },

    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep = (state.currentStep - 1) as 1 | 2 | 3 | 4 | 5;
      }
    },

    // Reset
    resetCreateEvent: (state) => {
      return initialState;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  selectTemplate,
  updateEventDetails,
  selectMessageType,
  startImageGeneration,
  imageGenerationSuccess,
  imageGenerationFailed,
  selectGuests,
  selectWhatsappTemplate,
  paymentSuccess,
  eventCreated,
  updateSendingStatus,
  sendingCompleted,
  goToStep,
  nextStep,
  previousStep,
  resetCreateEvent,
  setLoading,
  setError,
} = createEventSlice.actions;

export default createEventSlice.reducer;
