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

  // 🔥 Added User tag
  tagTypes: ["Guests", "Templates", "Events", "User"],

  endpoints: (builder) => ({
    // ================= AUTH =================

    signup: builder.mutation<
      void,
      { name: string; email: string; password: string,role:string }
    >({
      query: (data) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<
      void,
      { email: string; password: string }
    >({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    verifyOtp: builder.mutation<
      void,
      { email: string; otp: string; purpose: string}
    >({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation<
      void,
      { email: string ,purpose: string}
    >({
      query: (data) => ({
        url: "/api/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<
      void,
      { email: string }
    >({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      void,
      { email: string; password: string }
    >({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    changeOldPassword: builder.mutation<
      void,
      { email: string,oldPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/api/auth/reset-old-password",
        method: "POST",
        body: data,
      }),
    }), 
  


    logout: builder.mutation<void, {feedback:string}>({
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

    // ================= EVENTS =================

    createEvent: builder.mutation<
      CreateEventResponse,
      CreateEventRequest
    >({
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

    getEventDetails: builder.query<
      EventDetailsResponse,
      string
    >({
      query: (id) => ({
        url: `/api/events/${id}`,
      }),
    }),
// ================= PAYMENT=================    
    createOrder: builder.mutation({
  query: (body: { messageType: string; guestCount: number }) => ({
    url: "/api/payment/create-order",
    method: "POST",
    body,
  }),
}),

verifyPayment: builder.mutation({
  query: (body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => ({
    url: "/api/payment/verify",
    method: "POST",
    body,
  }),
}),
  }),
});

// ================= EXPORT HOOKS =================

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangeOldPasswordMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetGuestsQuery,
  useAddGuestsMutation,
  useGetTemplatesQuery,
  useCreateEventMutation,
  useGetEventsQuery,
  useGetEventDetailsQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation
} = apiSlice;