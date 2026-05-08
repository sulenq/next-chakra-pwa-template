import { toaster } from "@/components/ui/toaster";
import { MutationToastOptions, ToastMessage } from "@/lib/toast/toast.types";
import { getT } from "@/utils/locale";

// -----------------------------------------------------------------

/**
 * Resolve a human-readable error message from an Axios error.
 */
export function resolveErrorMessage(error: any): ToastMessage {
  const t = getT();
  const statusCode: number | undefined = error?.response?.status;
  const errorCase: string | undefined = error?.response?.data?.case;

  if (error?.code === "ERR_NETWORK") {
    return t.error_network;
  }

  switch (statusCode) {
    case 400:
      switch (errorCase) {
        case "VALIDATION_FAILED":
          return t.error_422_default;
        case "INVALID_CREDENTIALS":
          return t.error_invalid_credentials;
        default:
          return t.error_400_default;
      }

    case 401:
      return t.error_401_default;

    case 403:
      return t.error_403_default;

    case 404:
      return t.error_404_default;

    case 409:
      return t.error_409_default;

    case 413:
      return t.error_413_default;

    case 422:
      return t.error_422_default;

    case 429:
      return t.error_429_default;

    case 500:
      return t.error_500_default;

    case 503:
      return t.error_503_default;

    default:
      return t.error_default;
  }
}

// -----------------------------------------------------------------

/**
 * Show a loading toast identified by `id`.
 * Call toastSuccess or toastError with the same `id` to update it.
 */
export function toastLoading(
  id: string,
  message?: Partial<ToastMessage>,
): void {
  const defaults = getT().loading_default;
  toaster.loading({
    id,
    title: message?.title ?? defaults.title,
    description: message?.description ?? defaults.description,
  });
}

/**
 * Create/Update an existing loading toast to success state.
 */
export function toastSuccess(
  id: string,
  message?: Partial<ToastMessage>,
): void {
  const defaults = getT().success_default;
  toaster.update(id, {
    type: "success",
    title: message?.title ?? defaults.title,
    description: message?.description ?? defaults.description,
  });
}

/**
 * Create/Update an existing loading toast to error state.
 * If no loading toast was shown before, use toastErrorCreate instead.
 */
export function toastError(
  id: string,
  error?: any,
  message?: Partial<ToastMessage>,
): void {
  const resolved = error ? resolveErrorMessage(error) : getT().error_default;
  toaster.update(id, {
    type: "error",
    title: message?.title ?? resolved.title,
    description: message?.description ?? resolved.description,
  });
}

/**
 * Create a standalone error toast (no loading toast before it).
 */
export function toastErrorCreate(
  error?: any,
  message?: Partial<ToastMessage>,
): void {
  const resolved = error ? resolveErrorMessage(error) : getT().error_default;
  toaster.create({
    type: "error",
    title: message?.title ?? resolved.title,
    description: message?.description ?? resolved.description,
  });
}

/**
 * Dismiss a toast by id.
 */
export function toastDismiss(id: string): void {
  toaster.dismiss(id);
}

// -----------------------------------------------------------------

/**
 * Returns ready-to-use onMutate / onSuccess / onError handlers
 * for TanStack Query useMutation.
 *
 * @example
 * useMutation({
 *   mutationFn: ...,
 *   ...mutationToastHandlers("create-layanan"),
 *   onSuccess: () => {
 *     mutationToastHandlers("create-layanan").onSuccess(); // or manually call toastSuccess
 *     invalidateSomething();
 *   }
 * })
 *
 * Or spread + override specific callbacks:
 * const toast = mutationToastHandlers("create-layanan");
 * useMutation({
 *   mutationFn: ...,
 *   onMutate: toast.onMutate,
 *   onSuccess: () => { toast.onSuccess(); invalidateSomething(); },
 *   onError: toast.onError,
 * })
 */
export function mutationToastHandlers(
  id: string,
  options?: MutationToastOptions,
) {
  return {
    onMutate: () => {
      toastLoading(id, options?.loadingMessage);
    },
    onSuccess: () => {
      toastSuccess(id, options?.successMessage);
    },
    onError: (error: any) => {
      toastError(id, error, options?.errorMessage);
    },
  };
}
