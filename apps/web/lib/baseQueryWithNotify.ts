import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { notify } from "@/utils/notify";
import { logout } from "@/store/slices/authSlice";
import { notifyRequestSuccess, notifyRequestFailure } from "@/hooks/useConnectionMonitor";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

export const baseQueryWithNotify = async (args: any, api: any, extraOptions: any) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const errData = result.error.data as any;
    const isNetworkError = status === "FETCH_ERROR";

    notifyRequestFailure(isNetworkError);

    if (status === 401) {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      notify("Session expired, please login again", "error");
    } else if (status === 429) {
      notify("Too many requests", "error");
    } else if (status === "FETCH_ERROR") {
      notify("Cannot reach server", "error");
    } else if (status === 404) {
      notify("Route not found", "error");
    } else if (typeof status === "number" && status >= 500) {
      notify("Server error", "error");
    } else {
      notify(errData?.message || "Something went wrong", "error");
    }
  }

  if (result.data) {
    notifyRequestSuccess();
    const data = result.data as any;
    if (data?.notify !== false) {
      notify(data?.message || "Success", "success");
    }
  }

  return result;
};