export type HttpStatusCode = 400 | 401 | 403 | 404 | 422 | 429 | 500 | 503;

export type ToastMessage = {
  title: string;
  description?: string;
};

export interface ToastConfig {
  loading?: boolean | ToastMessage;
  success?: boolean | ToastMessage;
  error?: boolean | ErrorStatusConfig;
}

export type SuccessCase = string; // TODO mapping error case if required

export type SuccessCaseConfig = Record<SuccessCase, boolean | ToastMessage> & {
  default?: boolean | ToastMessage;
};

export type ErrorCase = string; // TODO mapping error case if required

export type ErrorCaseConfig = Record<ErrorCase, boolean | ToastMessage> & {
  default?: boolean | ToastMessage;
};

export type ErrorStatusConfig = Record<
  HttpStatusCode,
  boolean | ErrorCaseConfig
> & {
  default?: boolean | ToastMessage;
};

export interface HandleRequestOptions<T> {
  id: string;
  t: any;
  fn: () => Promise<T>;
  toast?: ToastConfig;
  onSuccess?: (res: T) => void;
  onError?: (err: any) => void;
}
