"use client";

import { P, PProps } from "@/components/ui/p";
import { useRequest } from "@/hooks/useRequest";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export const RandomQuote = (props: PProps) => {
  const [quote, setQuote] = useState<string>("");

  const { req, loading, error } = useRequest({
    id: "quote",
    absoluteUrl: `https://api.quotable.io/quotes/random?limit=1&maxLength=60`,
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  useEffect(() => {
    async function load() {
      const config = {
        method: "GET",
        withCredentials: false,
      };
      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            const picked = r?.data?.[0]?.content ?? "";
            setQuote(picked || "Stay sharp, keep moving.");
          },
        },
      });
    }

    load();
  }, []);

  if (loading) return <P {...props}>...</P>;
  if (error) return <P {...props}>Failed to load quote</P>;

  return <P {...props}>{quote}</P>;
};
