let notifyFn: (msg: string, type?: "success" | "error" | "info") => void;

export const setNotifier = (fn: typeof notifyFn) => {
  notifyFn = fn;
};

export const notify = (msg: string, type: "success" | "error" | "info" = "info") => {
  if (notifyFn) {
    notifyFn(msg, type);
  } else {
    console.warn("Notifier not initialized");
  }
};