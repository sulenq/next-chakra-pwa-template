"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { FeedbackStateProps } from "@/components/widgets/feedback-state";
import { useLocale } from "@/contexts/useLocale";

// -----------------------------------------------------------------

export default function FeedbackNotFound(props: FeedbackStateProps) {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <CContainer
      w={"fit"}
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
    </CContainer>
  );
}
