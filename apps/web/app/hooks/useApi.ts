"use client";

import { useNotification } from "@/context/NotificationContext";
import { createFetcher } from "@/lib/fetcher";

export const useApi = () => {
  const { addNotification } = useNotification();

  const fetcher = createFetcher(addNotification);

  return { fetcher };
};