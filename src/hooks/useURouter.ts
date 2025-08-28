import { client } from "@/utils/client";
import { useRouter } from "next/router";

export function useURouter() {
  const router = useRouter();

  if (!client()) return null;

  return router;
}
