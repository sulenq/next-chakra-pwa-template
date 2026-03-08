"use client";

import { useEffect, useState } from "react";
import { P } from "@/components/ui/p";
import { TextProps } from "@chakra-ui/react";
import useRequest from "@/hooks/useRequest";

interface Props extends TextProps {}

export const RandomQuote = (props: Props) => {
  const { ...restProps } = props;

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

  if (loading) return <P {...restProps}>...</P>;
  if (error) return <P {...restProps}>Failed to load quote</P>;

  return <P {...restProps}>{quote}</P>;
};
