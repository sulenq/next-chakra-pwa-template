import { ToastDecision, ToastMessage, ToastRules } from "./request.types";

const isToastMessage = (v: any): v is ToastMessage =>
  v && typeof v === "object" && "title" in v;

const isCaseConfig = (
  v: any,
): v is Record<string, ToastDecision> & {
  default?: ToastDecision;
} => {
  return v && typeof v === "object" && !("title" in v);
};

export const resolveLoadingToast = (
  rules?: ToastRules,
  t?: any,
): ToastMessage | null => {
  const loading = rules?.loading;

  if (!loading) return null;

  if (typeof loading === "boolean") {
    return {
      title: t.loading_default.title,
      description: t.loading_default.description,
    };
  }

  return loading;
};

export const resolveSuccessToast = (
  res: any,
  rules?: ToastRules,
  t?: any,
): ToastMessage | null => {
  const caseName = res?.data?.case;
  const success = rules?.success;

  if (!success) return null;

  if (typeof success === "boolean") {
    return {
      title: t.success_default.title,
      description: t.success_default.description,
    };
  }

  if (typeof success !== "object") return null;

  const msg =
    caseName && typeof caseName === "string"
      ? (success as Record<string, ToastDecision>)[caseName]
      : undefined;

  if (msg && typeof msg === "object" && "title" in msg) {
    return msg as ToastMessage;
  }

  return {
    title: t.success_default.title,
    description: t.success_default.description,
  };
};

export const resolveErrorToast = (
  err: any,
  rules?: ToastRules,
  t?: any,
): ToastMessage => {
  const status = err?.response?.status;
  const caseName = err?.response?.data?.case;

  const error = rules?.error;

  if (!error || typeof error === "boolean") {
    return t.error_default;
  }

  const statusRule = error[status as keyof typeof error];

  if (!statusRule) return t.error_default;

  if (isToastMessage(statusRule)) return statusRule;

  if (!isCaseConfig(statusRule)) {
    return t.error_default;
  }

  const caseRule = caseName ? statusRule[caseName] : undefined;

  if (isToastMessage(caseRule)) return caseRule;

  if (isToastMessage(statusRule.default)) {
    return statusRule.default;
  }

  return t.error_default;
};

export const shouldShowErrorToast = (err: any, rules?: ToastRules): boolean => {
  const status = err?.response?.status;
  const caseName = err?.response?.data?.case;

  const error = rules?.error;

  if (!error) return true;

  if (typeof error === "boolean") return error;

  const statusRule = error[status as keyof typeof error];

  if (!statusRule) return true;

  if (isToastMessage(statusRule)) return true;

  if (!isCaseConfig(statusRule)) return true;

  if (caseName && statusRule[caseName] === false) return false;

  if (statusRule.default === false) return false;

  return true;
};

// export const resolveToastMessage = (
//   err: any,
//   t: any,
//   rules?: ToastRules,
// ): ToastMessage => {
//   const status = err?.response?.status;
//   const caseName = err?.response?.data?.case;

//   // network error
//   if (err?.code === "ERR_NETWORK") {
//     return t.error_network;
//   }

//   // custom rules override (same concept as your old code)
//   if (rules?.error && typeof rules.error !== "boolean") {
//     const statusRule = rules.error[status as keyof typeof rules.error];

//     if (statusRule && typeof statusRule !== "boolean") {
//       const caseRule =
//         caseName && typeof statusRule === "object"
//           ? statusRule[caseName]
//           : undefined;

//       if (caseRule && typeof caseRule === "object") {
//         return caseRule;
//       }

//       if (statusRule.default && typeof statusRule.default === "object") {
//         return statusRule.default;
//       }
//     }
//   }

//   // fallback mapping (LIKE YOUR OLD useRequest)
//   switch (status) {
//     case 400:
//       if (caseName === "VALIDATION_FAILED") return t.error_422_default;
//       if (caseName === "INVALID_CREDENTIALS")
//         return t.error_signin_wrong_credentials;
//       return t.error_400_default;

//     case 401:
//       return t.error_401_default;

//     case 403:
//       return t.error_403_default;

//     case 404:
//       return t.error_404_default;

//     case 422:
//       return t.error_422_default;

//     case 429:
//       return t.error_429_default;

//     case 500:
//       return t.error_500_default;

//     default:
//       return t.error_default;
//   }
// };
