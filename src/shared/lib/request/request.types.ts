export type ToastMessage = {
  type?: "success" | "error" | "loading";
  title: string;
  description?: string;
};

export type ToastDecision = boolean | ToastMessage;

export type ErrorCaseConfig = Record<string, ToastDecision> & {
  default?: ToastDecision;
};

export type ErrorStatusConfig =
  | boolean
  | Record<number, ErrorCaseConfig | ToastDecision>;

export type ToastRules = {
  loading?: boolean | ToastMessage;
  success?: Record<string, ToastDecision> | ToastDecision;
  error?: ErrorStatusConfig;
};

export interface HandleRequestOptions<T> {
  id?: string;
  fn: (signal?: AbortSignal) => Promise<T>;
  t: any;
  toast?: ToastRules;
  onSuccess?: (res: T) => void;
  onError?: (err: any) => void;
}
