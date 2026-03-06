"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import useLang from "@/context/useLang";
import { Icon } from "@chakra-ui/react";
import { BanIcon } from "lucide-react";

export default function FeedbackForbidden(props: FeedbackStateProps) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Hooks
  const { t } = useLang();

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
        title={title ?? t.alert_forbidden.title}
        description={description ?? t.alert_forbidden.description}
        maxW={"300px"}
      />

      {children}
    </CContainer>
  );
}
