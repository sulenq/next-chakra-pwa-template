export function toFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;

    formData.append(key, value as string | Blob);
  });

  return formData;
}
