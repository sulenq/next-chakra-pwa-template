import { toaster } from "@/components/ui/toaster";
import {
  Interface__Req,
  Interface__RequestState,
} from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { clearAuthToken } from "@/utils/authToken";
import { removeStorage } from "@/utils/client";
import { request } from "@/utils/request";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

interface Props {
  id: string;
  showLoadingToast?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  loadingMessage?: { title?: string; description?: string };
  successMessage?: { title?: string; description?: string };
  errorMessage?: Record<
    number,
    Record<string, { title: string; description: string }> & {
      default?: { title: string; description: string };
    }
  >;
  signinPath?: string;
}

export default function useRequest<T = any>(props: Props) {
  const {
    id,
    showLoadingToast = true,
    showSuccessToast = true,
    showErrorToast = true,
    loadingMessage,
    successMessage,
    errorMessage,
    signinPath = "/",
  } = props;

  // Hooks
  const router = useRouter();

  // Contexts
  const { l } = useLang();

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

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
  const resolveErrorMessage = (e: any) => {
    const statusCode = e.response?.status;
    const errorCase = e.response?.data?.case;

    if (statusCode && errorMessage?.[statusCode]) {
      if (errorCase && errorMessage[statusCode][errorCase]) {
        return errorMessage[statusCode][errorCase];
      }
      return (
        errorMessage[statusCode].default || {
          title: l.error_default.title,
          description: l.error_default.description,
        }
      );
    }

    switch (e.code) {
      case "ERR_NETWORK":
        return l.error_network;
      default:
        return l.error_default;
    }
  };
  const req = useCallback(
    async ({ config, onResolve }: Interface__Req<T>) => {
      try {
        showLoadingToast &&
          toaster.loading({
            id,
            title: resolvedLoadingMessage.title,
            description: resolvedLoadingMessage.description,
            action: { label: "Close", onClick: () => {} },
          });

        safeSetState({ loading: true, error: null, status: null });

        config.url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${config.url}`;

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
          showSuccessToast
            ? toaster.update(id, {
                type: "success",
                title: resolvedSuccessMessage.title,
                description: resolvedSuccessMessage.description,
                action: { label: "Close", onClick: () => {} },
              })
            : toaster.dismiss(id);
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
            removeStorage("__auth_token");
            clearAuthToken();
            router?.push(signinPath);
            break;
          case 503:
            router?.push("/maintenance");
            break;
        }

        const msg = resolveErrorMessage(e);

        if (showErrorToast) {
          if (showLoadingToast) {
            toaster.update(id, {
              type: "error",
              ...msg,
              action: { label: "Close", onClick: () => {} },
            });
          } else {
            toaster.error({
              ...msg,
              action: { label: "Close", onClick: () => {} },
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
