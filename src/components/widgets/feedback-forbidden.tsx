"use client";

import { StackV } from "@/components/ui/stack";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/widgets/feedback-state";
import { LucideIcon } from "@/components/widgets/icon";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";
import { Icon } from "@chakra-ui/react";
import { BanIcon } from "lucide-react";

// -----------------------------------------------------------------

export default function FeedbackForbidden(props: FeedbackStateProps) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <StackV
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
    </StackV>
  );
}
