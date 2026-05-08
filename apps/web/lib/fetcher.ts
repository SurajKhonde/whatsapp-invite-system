import { NotificationType } from "@/types/notification";

type NotifyFn = (message: string, type?: NotificationType) => void;

export const createFetcher = (notify: NotifyFn) => {
  return async (url: string, options?: RequestInit) => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();

      // ❌ Error cases (AUTO notify)
      if (!res.ok) {
        if (res.status === 429) {
          notify("Too many requests. Try again later.", "error");
        } else if (res.status >= 500) {
          notify("Server error. Please try again.", "error");
        } else if (res.status === 401) {
          notify("Session expired. Please login again.", "error");
        }

        throw new Error(data.message || "Request failed");
      }

      // ✅ Optional success rule (VERY selective)
      if (data?.notify) {
        notify(data.message || "Success", "success");
      }

      return data;
    } catch (err: any) {
      notify(err.message || "Something went wrong", "error");
      throw err;
    }
  };
};
