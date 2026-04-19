
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithNotify } from "@/lib/baseQueryWithNotify";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithNotify,
  tagTypes: ["Guests"],

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

    // ================= GUEST =================

    getGuests: builder.query<any[], void>({
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
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetGuestsQuery,
  useAddGuestsMutation,
} = apiSlice;