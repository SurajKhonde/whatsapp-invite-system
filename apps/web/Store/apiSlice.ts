import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithNotify } from "@/lib/baseQueryWithNotify";

import { TemplateResponse } from "@/types/template";
import { GuestResponse } from "@/types/guest";
import { MeResponse, User } from "@/types/api.types";
import {
  GetEventsResponse,
  EventDetailsResponse,
  CreateEventRequest,
  CreateEventResponse,
} from "@/types/event.types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithNotify,

  // ✅ add Events tag
  tagTypes: ["Guests", "Templates", "Events"],

  endpoints: (builder) => ({
    // ================= AUTH =================

    signup: builder.mutation<void, { email: string; password: string }>({
      query: (data) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<void, { email: string; password: string }>({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<void, { email: string; otp: number }>({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: "/api/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => "/api/auth/me",
      transformResponse: (response: MeResponse) => response.data,
    }),

    // ================= GUEST =================

    getGuests: builder.query<GuestResponse, void>({
      query: () => "/api/guests",
      providesTags: ["Guests"],
    }),

    addGuests: builder.mutation<void, { guests: any[] }>({
      query: (guests) => ({
        url: "/api/guests/bulk",
        method: "POST",
        body: { guests },
      }),
      invalidatesTags: ["Guests"],
    }),

    // ================= TEMPLATE =================

    getTemplates: builder.query<TemplateResponse, void>({
      query: () => ({
        url: "/api/templates",
        method: "GET",
      }),
      providesTags: ["Templates"],
    }),

    // ================= EVENTS =================

    createEvent: builder.mutation<CreateEventResponse, CreateEventRequest>({
      query: (data) => ({
        url: "/api/events",
        method: "POST",
        body: data,
      }),

      // 🔥 refresh events list automatically
      invalidatesTags: ["Events"],
    }),

    getEvents: builder.query<GetEventsResponse, void>({
      query: () => "/api/events",
      providesTags: ["Events"],
    }),

    getEventDetails: builder.query<EventDetailsResponse, string>({
      query: (id) => `/api/events/${id}`,
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useGetGuestsQuery,
  useAddGuestsMutation,
  useGetTemplatesQuery,
  useCreateEventMutation,
  useGetEventsQuery,
  useGetEventDetailsQuery,
} = apiSlice;