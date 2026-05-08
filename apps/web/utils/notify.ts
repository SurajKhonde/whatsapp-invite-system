// utils/notify.ts
// CHANGE: added "warning" type

type NotifyType = "success" | "error" | "info" | "warning";

let notifyFn: (msg: string, type?: NotifyType) => void;

export const setNotifier = (fn: typeof notifyFn) => {
  notifyFn = fn;
};

export const notify = (msg: string, type: NotifyType = "info") => {
  if (notifyFn) {
    notifyFn(msg, type);
  } else {
    console.warn("Notifier not initialized:", msg);
  }
};
