"use client";

import { useEffect, useState } from "react";
import { P, PProps } from "@/components/ui/p";
import { http } from "@/api/http";

export const RandomQuote = (props: PProps) => {
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await http.get(
          "https://api.quotable.io/quotes/random?limit=1&maxLength=60",
          {
            signal: controller.signal,
            withCredentials: false,
          },
        );

        const picked = response?.data?.[0]?.content ?? "";
        setQuote(picked || "Stay sharp, keep moving.");
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();

    return () => controller.abort();
  }, []);

  if (loading) return <P {...props}>...</P>;
  if (error) return <P {...props}>Failed to load quote</P>;

  return <P {...props}>{quote}</P>;
};
