export interface ToastMessage {
  title: string;
  description: string;
}

export interface MutationToastOptions {
  loadingMessage?: Partial<ToastMessage>;
  successMessage?: Partial<ToastMessage>;
  errorMessage?: Partial<ToastMessage>;
}
