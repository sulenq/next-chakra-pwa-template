import useLang from "@/context/useLang";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useRef, useState } from "react";
import { toaster } from "../components/ui/toaster";
import { request } from "../utils/request";
import { clearAuthToken, setAuthToken } from "@/utils/authToken";
import { useRouter } from "next/router";

interface Interface__Req {
  config: AxiosRequestConfig;
  onResolve?: {
    onSuccess?: (r: AxiosResponse<any, any>) => void;
    onError?: (r: any) => void;
  };
}

interface Props {
  id: string;
  showLoadingToast?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  loadingMessage?: {
    title?: string;
    description?: string;
  };
  successMessage?: {
    title?: string;
    description?: string;
  };
  errorMessage?: Record<
    number,
    Record<string, { title: string; description: string }> & {
      default?: { title: string; description: string };
    }
  >;
  dataResource?: boolean;
  loginPath?: string;
}
const useRequestOld = (props: Props) => {
  // Props
  const {
    id,
    showLoadingToast = true,
    showSuccessToast = true,
    showErrorToast = true,
    loadingMessage,
    successMessage,
    errorMessage,
    loginPath = "/",
  } = props;

  //  Hooks
  const { l } = useLang();
  const router = useRouter();

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [response, setResponse] = useState<any>(undefined);
  const [error, setError] = useState<boolean>(false);
  const fLoadingMessage = {
    title: loadingMessage?.title || l.loading_default.title,
    description: loadingMessage?.description || l.loading_default.description,
  };
  const fSuccessMessage = {
    title: successMessage?.title || l.success_default.title,
    description: successMessage?.description || l.success_default.description,
  };

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Make request func
  function req({ config, onResolve }: Interface__Req) {
    showLoadingToast &&
      toaster.loading({
        id: id,
        title: fLoadingMessage.title,
        description: fLoadingMessage.description,
      });

    if (!loading) setLoading(true);
    if (error) setError(false);
    if (status) setStatus(undefined);

    // Add api base url
    config.url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${config.url}`;

    // Abort request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Start request
    request(config)
      .then((r) => {
        setStatus(r.status);
        if (r.status === 200 || r.status === 201 || r.status === 304) {
          setResponse(r);
          setLoading(false);
          if (onResolve?.onSuccess) {
            onResolve.onSuccess(r);
          }
        }

        showSuccessToast &&
          showLoadingToast &&
          toaster.update(id, {
            type: "success",
            title: fSuccessMessage.title,
            description: fSuccessMessage.description,
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
      })
      .catch((e) => {
        switch (e.code) {
          default:
            console.error(e);
            setError(true);
            break;
          case "ERR_CANCELED":
            setLoading(false);
            break;
        }

        switch (e.status) {
          case 401:
          case 403:
            // call logout func
            localStorage.removeItem("__auth_token");
            clearAuthToken();
            router.push(loginPath);
            break;
          case 503:
            router.push("/maintenance");
            break;
          // case 500:
          //   router.push("/server-error");
          //   break;
        }

        const errorToast = () => {
          const statusCode = e.status;
          const errorCase = e.response?.data?.case;

          // if (errorMessage?.[statusCode]) {
          //   if (errorCase && errorMessage[statusCode][errorCase]) {
          //     return errorMessage[statusCode][errorCase];
          //   }
          //   return (
          //     errorMessage[statusCode].default || {
          //       title: l.error_default_toast.title,
          //       description: l.error_default_toast.description,
          //     }
          //   );
          // } else if (e.code === "ERR_NETWORK") {
          //   return l.error_network_toast;
          // } else if (statusCode === 400) {
          //   switch (errorCase) {
          //     default:
          //       return {
          //         title: l.error_400_toast.title,
          //         description: l.error_400_toast.description,
          //       };
          //     case "SRS_REQUIRED":
          //       return {
          //         title: l.error_srs_required_toast.title,
          //         description: l.error_srs_required_toast.description,
          //       };
          //     case "FAILED_VALIDATION":
          //       return {
          //         title: l.error_422_toast.title,
          //         description: l.error_422_toast.description,
          //       };
          //     case "STEP_NOT_ALLOWED":
          //       return {
          //         title: l.error_403_toast.title,
          //         description: l.error_403_toast.description,
          //       };
          //     case "DUPLICATE_LAYER_NAME":
          //       return {
          //         title: l.error_duplicate_layer_name_toast.title,
          //         description: l.error_duplicate_layer_name_toast.description,
          //       };
          //     case "DUPLICATE_NAME":
          //       return {
          //         title: l.error_duplicate_name_toast.title,
          //         description: l.error_duplicate_name_toast.description,
          //       };
          //     case "DUPLICATE_EMAIL":
          //       return {
          //         title: l.error_duplicate_email_toast.title,
          //         description: l.error_duplicate_email_toast.description,
          //       };
          //   }
          // } else if (statusCode === 401) {
          //   return {
          //     title: l.error_401_toast.title,
          //     description: l.error_401_toast.description,
          //   };
          // } else if (statusCode === 403) {
          //   return {
          //     title: l.error_403_toast.title,
          //     description: l.error_403_toast.description,
          //   };
          // } else if (statusCode === 404) {
          //   switch (errorCase) {
          //     default:
          //       return {
          //         title: l.error_404_toast.title,
          //         description: l.error_404_toast.description,
          //       };
          //     case "LAYERS_NOT_FOUND":
          //       return {
          //         title: l.missing_layers_data_toast.title,
          //         description: l.missing_layers_data_toast.description,
          //       };
          //   }
          // } else if (statusCode === 409) {
          //   switch (errorCase) {
          //     default:
          //       return {
          //         title: l.error_409_toast.title,
          //         description: l.error_409_toast.description,
          //       };
          //     case "DUPLICATE_NAME":
          //       return {
          //         title: l.error_duplicate_name_toast.title,
          //         description: l.error_duplicate_name_toast.description,
          //       };
          //     case "DUPLICATE_EMAIL":
          //       return {
          //         title: l.error_duplicate_email_toast.title,
          //         description: l.error_duplicate_email_toast.description,
          //       };
          //   }
          // } else if (statusCode === 413) {
          //   switch (errorCase) {
          //     default:
          //       return {
          //         title: l.error_413_toast.title,
          //         description: l.error_413_toast.description,
          //       };
          //   }
          // } else if (statusCode === 429) {
          //   switch (errorCase) {
          //     default:
          //       return {
          //         title: l.error_429_toast.title,
          //         description: l.error_429_toast.description,
          //       };
          //   }
          // } else if (statusCode === 500) {
          //   return {
          //     title: l.error_500_toast.title,
          //     description: l.error_500_toast.description,
          //   };
          // }

          // Default error

          return {
            title: l.error_default.title,
            description: l.error_default.description,
          };
        };

        showErrorToast &&
          showLoadingToast &&
          toaster.update(id, {
            type: "error",
            ...errorToast(),
            action: {
              label: "Close",
              onClick: () => {},
            },
          });

        showErrorToast &&
          !showLoadingToast &&
          toaster.error({
            ...errorToast(),
            action: {
              label: "Close",
              onClick: () => {},
            },
          });

        onResolve?.onError?.(e);

        setStatus(e.response?.status);
        setResponse(e.response);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    req,
    loading,
    setLoading,
    status,
    setStatus,
    response,
    setResponse,
    error,
    setError,
  };
};

export default useRequestOld;
