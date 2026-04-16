import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  // 🔥 IMPORTANT
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

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // ================= GUEST =================


    // 🔥 GET ALL GUESTS
    getGuests:  builder.query<any[], void>({
      query: () => "/api/guests",
      providesTags: ["Guests"], // ✅ cache + refetch
    }),

    // 🔥 ADD BULK GUESTS
    addGuests: builder.mutation({
      query: (guests) => ({
        url: "/api/guests/bulk",
        method: "POST",
        body: { guests },
      }),

      // 🔥 THIS IS MAGIC
      invalidatesTags: ["Guests"], // auto refetch getGuests
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyOtpMutation,

  useGetGuestsQuery,
  useAddGuestsMutation,
} = apiSlice;