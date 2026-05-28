export type ToastMessage = {
  title: string;
  description: string;
};

export type MutationToastOptions = {
  loadingMessage?: Partial<ToastMessage>;
  successMessage?: Partial<ToastMessage>;
  errorMessage?: Partial<ToastMessage>;
};
