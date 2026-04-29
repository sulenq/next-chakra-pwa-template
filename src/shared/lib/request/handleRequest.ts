import { toaster } from "@/components/ui/toaster";
import { HandleRequestOptions } from "./types/request.types";
import { shouldShowErrorToast } from "./toastRules";
import { resolveErrorToast } from "./toastResolver";

export const handleRequest = async <T>({
  fn,
  t,
  toast,
  id,
  onSuccess,
  onError,
}: HandleRequestOptions<T>) => {
  try {
    if (toast?.loading) {
      const msg =
        typeof toast.loading === "object"
          ? toast.loading
          : {
              title: t.loading_default.title,
              description: t.loading_default.description,
            };

      toaster.loading({ id, ...msg });
    }

    const res = await fn();

    if (toast?.success) {
      const msg =
        typeof toast.success === "object"
          ? toast.success
          : {
              title: t.success_default.title,
              description: t.success_default.description,
            };

      if (toast?.loading) {
        toaster.update(id, { type: "success", ...msg });
      } else {
        toaster.success(msg);
      }
    } else {
      toaster.dismiss(id);
    }

    onSuccess?.(res);
    return res;
  } catch (e: any) {
    const status = e.response?.status;
    const errorCase = e.response?.data?.case;

    const show = shouldShowErrorToast(toast, status, errorCase);

    if (show) {
      const msg = resolveErrorToast(e, t, toast?.error);

      if (toast?.loading) {
        toaster.update(id, { type: "error", ...msg });
      } else {
        toaster.error(msg);
      }
    }

    onError?.(e);
    throw e;
  }
};
