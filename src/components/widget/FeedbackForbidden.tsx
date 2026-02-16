"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__FeedbackState } from "@/constants/props";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import useLang from "@/context/useLang";
import { Icon } from "@chakra-ui/react";
import { BanIcon } from "lucide-react";

export default function FeedbackForbidden(props: Props__FeedbackState) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      align={"center"}
      minH={MIN_H_FEEDBACK_CONTAINER}
      justify={"center"}
      {...restProps}
    >
      <FeedbackState
        icon={
          <Icon mb={title ? -2 : 0}>
            {icon || <LucideIcon icon={BanIcon} />}
          </Icon>
        }
        title={title ?? l.alert_forbidden.title}
        description={description ?? l.alert_forbidden.description}
        maxW={"300px"}
      />

      {children}
    </CContainer>
  );
}
