import { ToastMessage } from "./types/request.types";

export const resolveSuccessToast = (res: any, t: any, config?: any) => {
  const successCase = res?.data?.case;

  if (!config) {
    return {
      title: t.success_default.title,
      description: t.success_default.description,
    };
  }

  if (typeof config === "boolean") {
    return {
      title: t.success_default.title,
      description: t.success_default.description,
    };
  }

  if (successCase && config[successCase]) {
    const caseConfig = config[successCase];
    if (typeof caseConfig === "object") return caseConfig;
  }

  if (config.default && typeof config.default === "object") {
    return config.default;
  }

  return {
    title: t.success_default.title,
    description: t.success_default.description,
  };
};

export const resolveErrorToast = (
  e: any,
  t: any,
  errorMessage?: any,
): ToastMessage => {
  const statusCode = e.response?.status;
  const errorCase = e.response?.data?.case;

  if (e.code === "ERR_NETWORK") {
    return t.error_network;
  }

  if (statusCode && errorMessage?.[statusCode]) {
    if (errorCase && errorMessage[statusCode][errorCase]) {
      return errorMessage[statusCode][errorCase];
    }

    return (
      errorMessage[statusCode].default || {
        title: t.error_default.title,
        description: t.error_default.description,
      }
    );
  }

  switch (statusCode) {
    case 400:
      switch (errorCase) {
        case "VALIDATION_FAILED":
          return t.error_422_default;
        case "INVALID_CREDENTIALS":
          return t.error_signin_wrong_credentials;
        default:
          return t.error_400_default;
      }

    case 401:
      switch (errorCase) {
        case "FORBIDDEN_ROLE":
          return t.error_signin_wrong_credentials;
        default:
          return t.error_401_default;
      }

    case 403:
      return t.error_403_default;

    case 404:
      return t.error_404_default;

    case 422:
      return t.error_422_default;

    case 429:
      return t.error_429_default;

    case 500:
      return t.error_500_default;

    default:
      return t.error_default;
  }
};
