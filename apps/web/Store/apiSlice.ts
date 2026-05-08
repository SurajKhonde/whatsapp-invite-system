// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQueryWithNotify } from "@/lib/baseQueryWithNotify";
// import { TemplateResponse } from "@/types/template";
// import { MeResponse, User } from "@/types/api.types";
// import { GuestResponse, GuestInput, AddGuestsRequest } from "@/types/guest";
// import {
//   GetEventsResponse,
//   EventDetailsResponse,
//   CreateEventRequest,
//   CreateEventResponse,
// } from "@/types/event.types";

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: baseQueryWithNotify,
//   tagTypes: ["Guests", "Templates", "Events", "User", "Images"],

//   endpoints: (builder) => ({
//     // ================= AUTH =================
//     signup: builder.mutation<void, { name: string; email: string; password: string; role: string }>(
//       {
//         query: (data) => ({
//           url: "/api/auth/signup",
//           method: "POST",
//           body: data,
//         }),
//       }
//     ),

//     login: builder.mutation<void, { email: string; password: string }>({
//       query: (data) => ({
//         url: "/api/auth/login",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["User"],
//     }),

//     verifyOtp: builder.mutation<void, { email: string; otp: string; purpose: string }>({
//       query: (data) => ({
//         url: "/api/auth/verify-otp",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     resendOtp: builder.mutation<void, { email: string; purpose: string }>({
//       query: (data) => ({
//         url: "/api/auth/resend-otp",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     forgotPassword: builder.mutation<void, { email: string }>({
//       query: (data) => ({
//         url: "/api/auth/forgot-password",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     resetPassword: builder.mutation<void, { email: string; password: string }>({
//       query: (data) => ({
//         url: "/api/auth/reset-password",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     changeOldPassword: builder.mutation<
//       void,
//       { email: string; oldPassword: string; newPassword: string }
//     >({
//       query: (data) => ({
//         url: "/api/auth/reset-old-password",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     logout: builder.mutation<void, { feedback: string }>({
//       query: () => ({
//         url: "/api/auth/logout",
//         method: "POST",
//         credentials: "include",
//       }),
//       invalidatesTags: ["User"],
//     }),

//     getMe: builder.query<User, void>({
//       query: () => ({
//         url: "/api/auth/me",
//       }),
//       transformResponse: (response: MeResponse) => response.data,
//       providesTags: ["User"],
//     }),

//     // ================= GUEST =================
//     getGuests: builder.query<GuestResponse, void>({
//       query: () => ({ url: "/api/guests" }),
//       providesTags: ["Guests"],
//     }),

//     addGuests: builder.mutation<GuestResponse, AddGuestsRequest>({
//       query: (data) => ({
//         url: "/api/guests/bulk",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Guests"],
//     }),

//     // ================= TEMPLATE =================
//     getTemplates: builder.query<TemplateResponse, void>({
//       query: () => ({
//         url: "/api/templates",
//       }),
//       providesTags: ["Templates"],
//     }),

//     getWhatsappTemplates: builder.query<any, void>({
//       query: () => ({
//         url: "/api/whatsapp/templates",
//       }),
//       providesTags: ["Templates"],
//     }),

//     // ================= IMAGE GENERATION =================
//     generateImage: builder.mutation<any, any>({
//       query: (payload) => ({
//         url: "/api/whatsapp/images/generate",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["Images"],
//     }),

//     getImageStatus: builder.query<any, string>({
//       query: (jobId) => ({
//         url: `/api/whatsapp/images/${jobId}/status`,
//       }),
//       providesTags: (result, error, jobId) => [{ type: "Images", id: jobId }],
//     }),

//     // ================= WHATSAPP EVENTS =================
//     createWhatsappEvent: builder.mutation<any, any>({
//       query: (payload) => ({
//         url: "/api/whatsapp/events",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["Events"],
//     }),

//     getWhatsappEventStatus: builder.query<any, string>({
//       query: (eventId) => ({
//         url: `/api/whatsapp/events/${eventId}/status`,
//       }),
//       providesTags: (result, error, eventId) => [{ type: "Events", id: eventId }],
//     }),

//     getWhatsappEvents: builder.query<any, void>({
//       query: () => ({
//         url: "/api/whatsapp/events",
//       }),
//       providesTags: ["Events"],
//     }),

//     // ================= ORIGINAL EVENTS =================
//     createEvent: builder.mutation<CreateEventResponse, CreateEventRequest>({
//       query: (data) => ({
//         url: "/api/events",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Events"],
//     }),

//     getEvents: builder.query<GetEventsResponse, void>({
//       query: () => ({
//         url: "/api/events",
//       }),
//       providesTags: ["Events"],
//     }),

//     getEventDetails: builder.query<EventDetailsResponse, string>({
//       query: (id) => ({
//         url: `/api/events/${id}`,
//       }),
//     }),

//     // ================= PAYMENT =================
//     createOrder: builder.mutation<any, any>({
//       query: (body) => ({
//         url: "/api/payment/create-order",
//         method: "POST",
//         body,
//       }),
//     }),

//     verifyPayment: builder.mutation<any, any>({
//       query: (body) => ({
//         url: "/api/payment/verify",
//         method: "POST",
//         body,
//       }),
//     }),
//   }),
// });

// // ================= EXPORT HOOKS =================
// export const {
//   // Auth
//   useSignupMutation,
//   useLoginMutation,
//   useVerifyOtpMutation,
//   useResendOtpMutation,
//   useForgotPasswordMutation,
//   useResetPasswordMutation,
//   useChangeOldPasswordMutation,
//   useLogoutMutation,
//   useGetMeQuery,

//   // Guests
//   useGetGuestsQuery,
//   useAddGuestsMutation,

//   // Templates
//   useGetTemplatesQuery,
//   useGetWhatsappTemplatesQuery,

//   // Image Generation
//   useGenerateImageMutation,
//   useGetImageStatusQuery,

//   // WhatsApp Events
//   useCreateWhatsappEventMutation,
//   useGetWhatsappEventStatusQuery,
//   useGetWhatsappEventsQuery,

//   // Original Events
//   useCreateEventMutation,
//   useGetEventsQuery,
//   useGetEventDetailsQuery,

//   // Payment
//   useCreateOrderMutation,
//   useVerifyPaymentMutation,
// } = apiSlice;
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithNotify } from "@/lib/baseQueryWithNotify";
import { TemplateResponse } from "@/types/template";
import { MeResponse, User } from "@/types/api.types";
import { GuestResponse, GuestInput, AddGuestsRequest } from "@/types/guest";
import {
  GetEventsResponse,
  EventDetailsResponse,
  CreateEventRequest,
  CreateEventResponse,
} from "@/types/event.types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithNotify,
  tagTypes: ["Guests", "Templates", "Events", "User", "Images"],

  endpoints: (builder) => ({
    // ================= AUTH =================
    signup: builder.mutation<void, { name: string; email: string; password: string; role: string }>(
      {
        query: (data) => ({
          url: "/api/auth/signup",
          method: "POST",
          body: data,
        }),
      }
    ),

    login: builder.mutation<void, { email: string; password: string }>({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    verifyOtp: builder.mutation<void, { email: string; otp: string; purpose: string }>({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation<void, { email: string; purpose: string }>({
      query: (data) => ({
        url: "/api/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, { email: string; password: string }>({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    changeOldPassword: builder.mutation<
      void,
      { email: string; oldPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/api/auth/reset-old-password",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation<void, { feedback: string }>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/api/auth/me",
      }),
      transformResponse: (response: MeResponse) => response.data,
      providesTags: ["User"],
    }),

    // ================= GUEST =================
    getGuests: builder.query<GuestResponse, void>({
      query: () => ({ url: "/api/guests" }),
      providesTags: ["Guests"],
    }),

    addGuests: builder.mutation<GuestResponse, AddGuestsRequest>({
      query: (data) => ({
        url: "/api/guests/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Guests"],
    }),

    // ================= TEMPLATE =================
    getTemplates: builder.query<TemplateResponse, void>({
      query: () => ({
        url: "/api/templates",
      }),
      providesTags: ["Templates"],
    }),

    // NEW: Get text templates with pagination
    getTextTemplates: builder.query<any, { category?: string; page?: number; limit?: number }>({
      query: ({ category = "all", page = 1, limit = 12 }) => ({
        url: `/api/templates/text?category=${category}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["Templates"],
    }),

    // NEW: Get image templates with pagination
    getImageTemplates: builder.query<any, { category?: string; page?: number; limit?: number }>({
      query: ({ category = "all", page = 1, limit = 12 }) => ({
        url: `/api/templates/images?category=${category}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["Templates"],
    }),

    // NEW: Get template categories
    getTemplateCategories: builder.query<any, void>({
      query: () => ({
        url: "/api/templates/categories",
      }),
      providesTags: ["Templates"],
    }),

    // NEW: Get single template by ID
    getTemplateById: builder.query<any, string>({
      query: (id) => ({
        url: `/api/templates/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Templates", id }],
    }),

    getWhatsappTemplates: builder.query<any, void>({
      query: () => ({
        url: "/api/whatsapp/templates",
      }),
      providesTags: ["Templates"],
    }),

    // ================= IMAGE GENERATION =================
    generateImage: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/api/whatsapp/images/generate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Images"],
    }),

    getImageStatus: builder.query<any, string>({
      query: (jobId) => ({
        url: `/api/whatsapp/images/${jobId}/status`,
      }),
      providesTags: (result, error, jobId) => [{ type: "Images", id: jobId }],
    }),

    // ================= WHATSAPP EVENTS =================
    createWhatsappEvent: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/api/whatsapp/events",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Events"],
    }),

    getWhatsappEventStatus: builder.query<any, string>({
      query: (eventId) => ({
        url: `/api/whatsapp/events/${eventId}/status`,
      }),
      providesTags: (result, error, eventId) => [{ type: "Events", id: eventId }],
    }),

    getWhatsappEvents: builder.query<any, void>({
      query: () => ({
        url: "/api/whatsapp/events",
      }),
      providesTags: ["Events"],
    }),

    // ================= ORIGINAL EVENTS =================
    createEvent: builder.mutation<CreateEventResponse, CreateEventRequest>({
      query: (data) => ({
        url: "/api/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),

    getEvents: builder.query<GetEventsResponse, void>({
      query: () => ({
        url: "/api/events",
      }),
      providesTags: ["Events"],
    }),

    getEventDetails: builder.query<EventDetailsResponse, string>({
      query: (id) => ({
        url: `/api/events/${id}`,
      }),
    }),

    // ================= PAYMENT =================
    createOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/payment/create-order",
        method: "POST",
        body,
      }),
    }),

    verifyPayment: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/payment/verify",
        method: "POST",
        body,
      }),
    }),
  }),
});

// ================= EXPORT HOOKS =================
export const {
  // Auth
  useSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangeOldPasswordMutation,
  useLogoutMutation,
  useGetMeQuery,

  // Guests
  useGetGuestsQuery,
  useAddGuestsMutation,

  // Templates
  useGetTemplatesQuery,
  useGetTextTemplatesQuery,
  useGetImageTemplatesQuery,
  useGetTemplateCategoriesQuery,
  useGetTemplateByIdQuery,
  useGetWhatsappTemplatesQuery,

  // Image Generation
  useGenerateImageMutation,
  useGetImageStatusQuery,

  // WhatsApp Events
  useCreateWhatsappEventMutation,
  useGetWhatsappEventStatusQuery,
  useGetWhatsappEventsQuery,

  // Original Events
  useCreateEventMutation,
  useGetEventsQuery,
  useGetEventDetailsQuery,

  // Payment
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} = apiSlice;