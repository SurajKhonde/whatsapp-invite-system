import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// =====================================================
// TYPES
// =====================================================

export interface SelectedTemplate {
  id: string;
  title?: string;
  name?: string;
  category: string;
  type?: string;
  hasImage?: boolean;
  textContent?: string;
  imageUrl?: string;
  previewImageUrl?: string;
  parameters?: any;
  placeholders?: any;
  [key: string]: any;
}

export interface EventDetails {
  groomName?: string;
  brideName?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  templateParams?: any;
  [key: string]: any;
}

export interface ImageGeneration {
  status: "idle" | "generating" | "success" | "error";
  jobId?: string;
  imageUrl?: string;
  error?: string;
}

export interface Pricing {
  baseCost: number;
  perGuestCost: number;
  profit: number;
  total: number;
  [key: string]: any;
}

export interface SendingStatus {
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  pendingCount: number;
}

export interface CreateEventState {
  // =====================================================
  // STEP 1: TEMPLATE SELECTION
  // =====================================================
  selectedTemplate: SelectedTemplate | null;
  templates: SelectedTemplate[];

  // =====================================================
  // STEP 2: EVENT DETAILS
  // =====================================================
  eventDetails: EventDetails;
  messageType: "text_only" | "image_only" | "image_and_text";
  imageGeneration: ImageGeneration;

  // =====================================================
  // STEP 3: GUEST SELECTION
  // =====================================================
  selectedGuests: string[];
  guests: any[];
  whatsappTemplateId: string;

  // =====================================================
  // STEP 4: PAYMENT
  // =====================================================
  pricing: Pricing;
  paymentId: string;

  // =====================================================
  // STEP 5: EVENT TRACKING
  // =====================================================
  eventId: string;
  sending: SendingStatus;

  // =====================================================
  // UI
  // =====================================================
  currentStep: 1 | 2 | 3 | 4 | 5;
  loading: boolean;
  error: string | null;
}

// =====================================================
// INITIAL STATE
// =====================================================

const initialState: CreateEventState = {
  selectedTemplate: null,
  templates: [],

  eventDetails: {},
  messageType: "text_only",
  imageGeneration: {
    status: "idle",
  },

  selectedGuests: [],
  guests: [],
  whatsappTemplateId: "",

  pricing: {
    baseCost: 0,
    perGuestCost: 0,
    profit: 0,
    total: 0,
  },
  paymentId: "",

  eventId: "",
  sending: {
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

// =====================================================
// SLICE
// =====================================================

const createEventSlice = createSlice({
  name: "createEvent",
  initialState,
  reducers: {
    // =====================================================
    // STEP 1: TEMPLATE
    // =====================================================

    selectTemplate: (state, action: PayloadAction<SelectedTemplate>) => {
      state.selectedTemplate = action.payload;
    },

    setTemplates: (state, action: PayloadAction<SelectedTemplate[]>) => {
      state.templates = action.payload;
    },

    // =====================================================
    // STEP 2: EVENT DETAILS
    // =====================================================

    updateEventDetails: (state, action: PayloadAction<EventDetails>) => {
      state.eventDetails = {
        ...state.eventDetails,
        ...action.payload,
      };
    },

    selectMessageType: (
      state,
      action: PayloadAction<"text_only" | "image_only" | "image_and_text">
    ) => {
      state.messageType = action.payload;
    },

    // =====================================================
    // IMAGE GENERATION
    // =====================================================

    startImageGeneration: (state, action: PayloadAction<string>) => {
      state.imageGeneration = {
        status: "generating",
        jobId: action.payload,
      };
    },

    imageGenerationSuccess: (state, action: PayloadAction<string>) => {
      state.imageGeneration = {
        status: "success",
        imageUrl: action.payload,
      };
    },

    imageGenerationFailed: (state, action: PayloadAction<string>) => {
      state.imageGeneration = {
        status: "error",
        error: action.payload,
      };
    },

    // =====================================================
    // STEP 3: GUESTS
    // =====================================================

    setGuests: (state, action: PayloadAction<any[]>) => {
      state.guests = action.payload;
    },

    selectGuests: (state, action: PayloadAction<string[]>) => {
      state.selectedGuests = action.payload;
    },

    // =====================================================
    // WHATSAPP TEMPLATE
    // =====================================================

    selectWhatsappTemplate: (state, action: PayloadAction<string>) => {
      state.whatsappTemplateId = action.payload;
    },

    // =====================================================
    // STEP 4: PAYMENT
    // =====================================================

    setPricing: (state, action: PayloadAction<Pricing>) => {
      state.pricing = action.payload;
    },

    paymentSuccess: (state, action: PayloadAction<string>) => {
      state.paymentId = action.payload;
    },

    // =====================================================
    // STEP 5: EVENT & SENDING
    // =====================================================

    eventCreated: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
    },

    updateSendingStatus: (state, action: PayloadAction<SendingStatus>) => {
      state.sending = action.payload;
    },

    sendingCompleted: (state) => {
      state.sending = {
        sentCount: state.selectedGuests.length,
        deliveredCount: state.selectedGuests.length,
        readCount: 0,
        failedCount: 0,
        pendingCount: 0,
      };
    },

    // =====================================================
    // NAVIGATION
    // =====================================================

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

    goToStep: (state, action: PayloadAction<1 | 2 | 3 | 4 | 5>) => {
      if (action.payload >= 1 && action.payload <= 5) {
        state.currentStep = action.payload;
      }
    },

    // =====================================================
    // RESET & UI
    // =====================================================

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

// =====================================================
// EXPORTS
// =====================================================

export const {
  selectTemplate,
  setTemplates,
  updateEventDetails,
  selectMessageType,
  startImageGeneration,
  imageGenerationSuccess,
  imageGenerationFailed,
  setGuests,
  selectGuests,
  selectWhatsappTemplate,
  setPricing,
  paymentSuccess,
  eventCreated,
  updateSendingStatus,
  sendingCompleted,
  nextStep,
  previousStep,
  goToStep,
  resetCreateEvent,
  setLoading,
  setError,
} = createEventSlice.actions;

export default createEventSlice.reducer;