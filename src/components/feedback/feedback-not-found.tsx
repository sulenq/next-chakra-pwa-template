"use client";

import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { FeedbackStateProps } from "@/components/feedback/feedback-state";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";

// -----------------------------------------------------------------

export default function FeedbackNotFound(props: FeedbackStateProps) {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { t } = useLocaleStore();

  return (
    <StackV
      m={"auto"}
      minH={"100px"}
      justify={"center"}
      align={"center"}
      color={"fg.subtle"}
      gap={1}
      {...restProps}
    >
      <P textAlign={"center"}>{t.alert_not_found.title}</P>

      {children}
    </StackV>
  );
}
