import { ToastConfig, HttpStatusCode } from "./types/request.types";

export const shouldShowErrorToast = (
  config?: ToastConfig,
  status?: HttpStatusCode,
  errorCase?: string,
) => {
  if (!config?.error) return false;

  if (typeof config.error === "boolean") return config.error;

  const statusConfig = config.error[status as HttpStatusCode];

  if (statusConfig === false) return false;

  if (typeof statusConfig === "object") {
    if (errorCase && statusConfig[errorCase] === false) return false;
    return statusConfig.default ?? true;
  }

  return config.error.default ?? true;
};
