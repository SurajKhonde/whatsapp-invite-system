import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

export const baseQueryWithNotify = async (args: any, api: any, extraOptions: any) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // ❌ Handle Errors
  if (result.error) {
    const status = result.error.status;

    if (status === 429) {
      api.dispatch({
        type: "notification/add",
        payload: { message: "Too many requests", type: "error" },
      });
    }

    if (status === 401) {
      api.dispatch({
        type: "notification/add",
        payload: { message: "Session expired", type: "error" },
      });
    }

    if (typeof status === "number" && status >= 500) {
      api.dispatch({
        type: "notification/add",
        payload: { message: "Server error", type: "error" },
      });
    }
  }

  // ✅ Handle Success
  if (result.data) {
    const data = result.data as { message?: string; notify?: boolean };

    if (data.notify) {
      api.dispatch({
        type: "notification/add",
        payload: {
          message: data.message || "Success",
          type: "success",
        },
      });
    }
  }

  return result;
};