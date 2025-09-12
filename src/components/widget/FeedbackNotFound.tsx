"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Props__FeedbackState } from "@/constants/props";
import useLang from "@/context/useLang";

export default function FeedbackNotFound(props: Props__FeedbackState) {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const { l } = useLang();

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
      <P textAlign={"center"}>{l.alert_not_found.title}</P>

      {children}
    </CContainer>
  );
}
