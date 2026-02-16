import { toaster } from "@/components/ui/toaster";
import {
  Interface__Req,
  Interface__RequestState,
} from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { clearAccessToken, clearUserData } from "@/utils/auth";
import { request } from "@/utils/request";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

interface Props {
  id: string;
  absoluteUrl?: string;
  showLoadingToast?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  loadingMessage?: { title?: string; description?: string };
  successMessage?: { title?: string; description?: string };
  errorMessage?: Record<
    number,
    Record<string, { type?: string; title: string; description: string }> & {
      default?: { type: "error"; title: string; description: string };
    }
  >;
  signinPath?: string;
}

export default function useRequest<T = any>(props: Props) {
  // Props
  const {
    id,
    absoluteUrl,
    showLoadingToast = true,
    showSuccessToast = true,
    showErrorToast = true,
    loadingMessage,
    successMessage,
    errorMessage,
    signinPath = "/",
  } = props;

  // Contexts
  const { l } = useLang();

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hooks
  const router = useRouter();

  // States
  const [reqState, setReqState] = useState<Interface__RequestState<T>>({
    loading: false,
    status: null,
    error: null,
    response: null,
  });
  const { loading, status, error, response } = reqState;
  const resolvedLoadingMessage = {
    title: loadingMessage?.title || l.loading_default.title,
    description: loadingMessage?.description || l.loading_default.description,
  };
  const resolvedSuccessMessage = {
    title: successMessage?.title || l.success_default.title,
    description: successMessage?.description || l.success_default.description,
  };

  // Utils
  const safeSetState = useCallback(
    (update: Partial<Interface__RequestState<T>>) => {
      setReqState((prev) => ({ ...prev, ...update }));
    },
    []
  );
  const resolveToastProps = (e: any) => {
    const statusCode = e.response?.status;
    const errorCase = e.response?.data?.case;

    // Handle network-level errors first
    if (e.code === "ERR_NETWORK") {
      return l.error_network;
    }

    // Check if a custom error message is provided for this status code and case
    if (statusCode && errorMessage?.[statusCode]) {
      if (errorCase && errorMessage[statusCode][errorCase]) {
        return errorMessage[statusCode][errorCase];
      }
      // Fallback to default custom message for this status code
      return (
        errorMessage[statusCode].default || {
          title: l.error_default.title,
          description: l.error_default.description,
        }
      );
    }

    // Switch-based handling for known status codes
    switch (statusCode) {
      case 400:
        switch (errorCase) {
          case "VALIDATION_FAILED":
            return l.error_422_default;
          case "INVALID_CREDENTIALS":
            return l.error_signin_wrong_credentials;
          default:
            return l.error_400_default;
        }

      case 401:
        switch (errorCase) {
          case "FORBIDDEN_ROLE":
            return l.error_signin_wrong_credentials;
          default:
            return l.error_401_default;
        }

      case 403:
        switch (errorCase) {
          default:
            return l.error_403_default;
        }

      case 404:
        switch (errorCase) {
          default:
            return l.error_404_default;
        }

      case 422:
        switch (errorCase) {
          default:
            return l.error_422_default;
        }

      case 429:
        switch (errorCase) {
          default:
            return l.error_429_default;
        }

      case 500:
        switch (errorCase) {
          default:
            return l.error_500_default;
        }

      default:
        switch (errorCase) {
          default:
            return l.error_default;
        }
    }
  };
  const req = useCallback(
    async ({ config, onResolve }: Interface__Req<T>) => {
      try {
        if (showLoadingToast) {
          toaster.loading({
            id,
            title: resolvedLoadingMessage.title,
            description: resolvedLoadingMessage.description,
          });
        }

        safeSetState({ loading: true, error: null, status: null });

        config.url =
          absoluteUrl || `${process.env.NEXT_PUBLIC_API_BASE_URL}${config.url}`;

        if (abortControllerRef.current) abortControllerRef.current.abort();
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        config.signal = abortController.signal;

        const r = await request<T>(config);

        safeSetState({
          loading: false,
          status: r.status,
          response: r,
        });

        if ([200, 201, 304].includes(r.status)) {
          onResolve?.onSuccess?.(r);
          if (showSuccessToast) {
            toaster.update(id, {
              type: "success",
              title: resolvedSuccessMessage.title,
              description: resolvedSuccessMessage.description,
            });
          } else {
            toaster.dismiss(id);
          }
        }

        return r;
      } catch (e: any) {
        if (e.code === "ERR_CANCELED") {
          safeSetState({ loading: false });
          return;
        }

        const statusCode = e.response?.status;
        safeSetState({
          loading: false,
          error: true,
          status: statusCode,
          response: e.response,
        });

        switch (statusCode) {
          case 401:
          case 403:
            if (!absoluteUrl) {
              clearAccessToken();
              clearUserData();
              router?.push(signinPath);
            }
            break;
          case 503:
            router?.push("/maintenance");
            break;
        }

        const toastProps = resolveToastProps(e);

        if (showErrorToast) {
          if (showLoadingToast) {
            toaster.update(id, {
              type: "error",
              ...toastProps,
            });
          } else {
            toaster.create({
              type: "error",
              ...toastProps,
            });
          }
        }

        onResolve?.onError?.(e);
        throw e;
      }
    },
    [
      id,
      showLoadingToast,
      showSuccessToast,
      showErrorToast,
      resolvedLoadingMessage,
      resolvedSuccessMessage,
      signinPath,
      errorMessage,
      l,
      router,
      safeSetState,
    ]
  );

  return { req, loading, status, error, response, setReqState };
}
