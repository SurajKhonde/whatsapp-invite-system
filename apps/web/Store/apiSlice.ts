
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithNotify } from "@/lib/baseQueryWithNotify";
import { TemplateResponse } from "@/types/template";
import { GuestResponse } from "@/types/guest";
import { MeResponse ,User} from "@/types/api.types";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithNotify,
  tagTypes: ["Guests", "Templates"],

  endpoints: (builder) => ({
    // ================= AUTH =================

    signup: builder.mutation({
      query: (data) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
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

    addGuests: builder.mutation({
      query: (guests) => ({
        url: "/api/guests/bulk",
        method: "POST",
        body: { guests },
      }),
      invalidatesTags: ["Guests"],
    }),
  getTemplates: builder.query<TemplateResponse, void>({
  query: () => ({
    url: "/api/templates",
    method: "GET",
  }),
  providesTags: ["Templates"],
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
} = apiSlice;