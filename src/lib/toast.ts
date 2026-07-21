/**
 * Thin wrapper over `sonner` for consistent toast notifications.
 * Import `showToast` instead of using sonner directly for uniform styling.
 */
import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) =>
    toast.success(message, {
      description,
      duration: 4000,
    }),

  error: (message: string, description?: string) =>
    toast.error(message, {
      description,
      duration: 5000,
    }),

  info: (message: string, description?: string) =>
    toast.info(message, {
      description,
      duration: 3500,
    }),

  loading: (message: string) =>
    toast.loading(message),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) =>
    toast.promise(promise, messages),
};
