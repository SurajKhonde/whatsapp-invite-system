import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ApiErrorResponse } from "@/types/api.types";

export const getErrorMessage = (err: unknown): string => {
  if (typeof err === "object" && err !== null && "status" in err) {
    const apiError = err as FetchBaseQueryError;

    if ("data" in apiError && typeof apiError.data === "object" && apiError.data !== null) {
      const data = apiError.data as ApiErrorResponse;

      if (typeof data.message === "string") {
        return data.message;
      }
    }
  }

  return "Something went wrong";
};
