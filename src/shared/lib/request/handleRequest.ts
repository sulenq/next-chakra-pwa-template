import { HandleRequestOptions } from "./request.types";
import {
  resolveErrorToast,
  resolveLoadingToast,
  resolveSuccessToast,
  shouldShowErrorToast,
} from "./toast";
import { toaster } from "@/components/ui/toaster";

export const handleRequest = async <T>({
  fn,
  t,
  toast,
  id,
  onSuccess,
  onError,
}: HandleRequestOptions<T>) => {
  try {
    const loading = resolveLoadingToast(toast, t);

    if (loading) {
      toaster.loading({ id, ...loading });
    }

    const res = await fn();

    const success = resolveSuccessToast(res, toast, t);

    if (success) {
      toaster.success(success);
    }

    onSuccess?.(res);
    return res;
  } catch (err: any) {
    if (shouldShowErrorToast(err, toast)) {
      const msg = resolveErrorToast(err, toast, t);
      toaster.error(msg);
    }

    onError?.(err);
    throw err;
  }
};
