"use client";

import { StackV } from "@/components/ui/stack";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/feedback/feedback-state";
import { LucideIcon } from "@/components/misc/icon";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { Icon } from "@chakra-ui/react";
import { BanIcon } from "lucide-react";

// -----------------------------------------------------------------

export default function FeedbackForbidden(props: FeedbackStateProps) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();

  return (
    <StackV
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
