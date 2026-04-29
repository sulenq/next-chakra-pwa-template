"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/widgets/feedback-state";
import { LucideIcon } from "@/components/widgets/icon";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { Icon } from "@chakra-ui/react";
import { BanIcon } from "lucide-react";

// -----------------------------------------------------------------

export default function FeedbackForbidden(props: FeedbackStateProps) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

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
