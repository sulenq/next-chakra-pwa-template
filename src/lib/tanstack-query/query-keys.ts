export const queryKeys = {
  layanan: {
    all: ["layanan"] as const,
    list: (params?: unknown) => ["layanan", "list", params] as const,
    detail: (id: string) => ["layanan", "detail", id] as const,
  },
};
