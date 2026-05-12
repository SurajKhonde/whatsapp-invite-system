import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithNotify } from "@/lib/baseQueryWithNotify";

import {
  MeResponse,
  User,
} from "@/types/api.types";

import {
  GuestResponse,
  AddGuestsRequest,
} from "@/types/guest";

export const apiSlice =
  createApi({
    reducerPath: "api",

    baseQuery:
      baseQueryWithNotify,

    tagTypes: [
      "Guests",
      "Templates",
      "Events",
      "User",
      "Images",
      "PricingConfig"
    ],

    endpoints: (
      builder
    ) => ({
   
      signup:
        builder.mutation<
          void,
          {
            name: string;
            email: string;
            password: string;
            role: string;
          }
        >({
          query: (body) => ({
            url: "/api/auth/signup",
            method: "POST",
            body,
          }),
        }),

      login:
        builder.mutation<
          void,
          {
            email: string;
            password: string;
          }
        >({
          query: (body) => ({
            url: "/api/auth/login",
            method: "POST",
            body,
          }),
          invalidatesTags: ["User"],
        }),

      verifyOtp:
        builder.mutation<
          void,
          {
            email: string;
            otp: string;
            purpose: string;
          }
        >({
          query: (body) => ({
            url: "/api/auth/verify-otp",
            method: "POST",
            body,
          }),
        }),

      resendOtp:
        builder.mutation<
          void,
          {
            email: string;
            purpose: string;
          }
        >({
          query: (body) => ({
            url: "/api/auth/resend-otp",
            method: "POST",
            body,
          }),
        }),

      forgotPassword:
        builder.mutation<
          void,
          {
            email: string;
          }
        >({
          query: (body) => ({
            url: "/api/auth/forgot-password",
            method: "POST",
            body,
          }),
        }),

      resetPassword:
        builder.mutation<
          void,
          {
            email: string;
            password: string;
          }
        >({
          query: (body) => ({
            url: "/api/auth/reset-password",
            method: "POST",
            body,
          }),
        }),

      changeOldPassword:
        builder.mutation<
          void,
          {
            email: string;
            oldPassword: string;
            newPassword: string;
          }
        >({
          query: (body) => ({
            url: "/api/auth/reset-old-password",
            method: "POST",
            body,
          }),
        }),

      logout:
        builder.mutation<void, void>({
          query: () => ({
            url: "/api/auth/logout",
            method: "POST",
            credentials: "include",
          }),
          invalidatesTags: ["User"],
        }),
        getMe: builder.query<User, void>({
  query: () => "/api/auth/me",

  transformResponse: (response: MeResponse) => {
    return {
      ...response.data,
      profileImageUrl:
        response.data.profileImageUrl || null,
    };
  },

  providesTags: ["User"],
}),

      getGuests:
        builder.query<GuestResponse, void>({
          query: () => ({
            url: "/api/guests",
          }),
          providesTags: ["Guests"],
        }),

      addGuests:
        builder.mutation<
          GuestResponse,
          AddGuestsRequest
        >({
          query: (body) => ({
            url: "/api/guests/bulk",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Guests"],
        }),

      // =========================================================
      // TEMPLATES
      // =========================================================

      getTemplates:
        builder.query<any, void>({
          query: () => ({
            url: "/api/templates",
          }),
          providesTags: ["Templates"],
        }),

      getTextTemplates:
        builder.query<
          any,
          {
            category?: string;
          }
        >({
          query: ({ category = "all" }) => ({
            url:
              category === "all"
                ? "/api/templates/text"
                : `/api/templates/category/${category}`,
          }),
          providesTags: ["Templates"],
        }),

      getImageTemplates:
        builder.query<
          any,
          {
            category?: string;
          }
        >({
          query: ({ category = "all" }) => ({
            url:
              category === "all"
                ? "/api/templates/images"
                : `/api/templates/category/${category}`,
          }),
          providesTags: ["Templates"],
        }),

      getTemplateCategories:
        builder.query<any, void>({
          query: () => ({
            url: "/api/templates/categories",
          }),
          providesTags: ["Templates"],
        }),

      getTemplateById:
        builder.query<any, string>({
          query: (id) => ({
            url: `/api/templates/${id}`,
          }),
          providesTags: (result, error, id) => [
            {
              type: "Templates",
              id,
            },
          ],
        }),

      createTemplate:
        builder.mutation<any, any>({
          query: (body) => ({
            url: "/api/templates",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Templates"],
        }),

      deleteTemplate:
        builder.mutation<any, string>({
          query: (id) => ({
            url: `/api/templates/${id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Templates"],
        }),

      // =========================================================
      // EVENTS
      // =========================================================

      createEvent:
        builder.mutation<any, any>({
          query: (body) => ({
            url: "/api/events",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Events"],
        }),

      getEvents:
        builder.query<any, void>({
          query: () => ({
            url: "/api/events",
          }),
          providesTags: ["Events"],
        }),

      getEventById:
        builder.query<any, string>({
          query: (id) => ({
            url: `/api/events/${id}`,
          }),
          providesTags: (result, error, id) => [
            {
              type: "Events",
              id,
            },
          ],
        }),

      getEventStatus:
        builder.query<any, string>({
          query: (eventId) => ({
            url: `/api/events/${eventId}/status`,
          }),
          providesTags: (result, error, eventId) => [
            {
              type: "Events",
              id: eventId,
            },
          ],
        }),

      updateEvent:
        builder.mutation<
          any,
          {
            id: string;
            body: any;
          }
        >({
          query: ({ id, body }) => ({
            url: `/api/events/${id}`,
            method: "PATCH",
            body,
          }),
          invalidatesTags: (result, error, { id }) => [
            {
              type: "Events",
              id,
            },
            "Events",
          ],
        }),

      deleteEvent:
        builder.mutation<any, string>({
          query: (id) => ({
            url: `/api/events/${id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Events"],
        }),

      resendEvent:
        builder.mutation<any, string>({
          query: (id) => ({
            url: `/api/events/${id}/resend`,
            method: "POST",
          }),
          invalidatesTags: (result, error, id) => [
            {
              type: "Events",
              id,
            },
          ],
        }),

      // =========================================================
      // IMAGE GENERATION
      // =========================================================

      registerImageTemplate:
        builder.mutation<any, any>({
          query: (body) => ({
            url: "/api/image-template/register",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Images"],
        }),

      generatePreview:
        builder.mutation<any, any>({
          query: (body) => ({
            url: "/api/image-template/generate-preview",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Images"],
        }),

      getImageStatus:
        builder.query<any, string>({
          query: (id) => ({
            url: `/api/image-template/${id}/status`,
          }),
          providesTags: (result, error, id) => [
            {
              type: "Images",
              id,
            },
          ],
        }),

      // =========================================================
      // PAYMENT
      // =========================================================

      createOrder:
        builder.mutation<any, any>({
          query: (body) => ({
            url: "/api/payment/create-order",
            method: "POST",
            body,
          }),
        }),

      verifyPayment:
        builder.mutation<any, any>({
          query: (body) => ({
            url: "/api/payment/verify",
            method: "POST",
            body,
          }),
        }),

      // =========================================================
      // PRICING CONFIG
      // =========================================================

      getPricingConfig:
        builder.query<
          any,
          string
        >({
          query: (messageType) => ({
            url: `/api/pricing-config/${messageType}`,
          }),
          providesTags: ["PricingConfig"],
        }),

      getAllPricingConfigs:
        builder.query<any, void>({
          query: () => ({
            url: "/api/pricing-config",
          }),
          providesTags: ["PricingConfig"],
        }),

      calculatePricing:
        builder.mutation<
          any,
          {
            message_type: string;
            guest_count: number;
          }
        >({
          query: (data) => ({
            url: "/api/pricing-config/calculate",
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["PricingConfig"],
        }),
    }),
  });

// =========================================================
// EXPORT HOOKS
// =========================================================

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
  useCreateTemplateMutation,
  useDeleteTemplateMutation,

  // Events
  useCreateEventMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useGetEventStatusQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useResendEventMutation,

  // Images
  useRegisterImageTemplateMutation,
  useGeneratePreviewMutation,
  useGetImageStatusQuery,

  // Payment
  useCreateOrderMutation,
  useVerifyPaymentMutation,

  // Pricing Config
  useGetPricingConfigQuery,
  useGetAllPricingConfigsQuery,
  useCalculatePricingMutation,
} = apiSlice;