"use client";

import { Btn } from "@/components/ui/btn";
import { StackV } from "@/components/ui/stack";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/widgets/feedback-state";
import { LucideIcon } from "@/components/widgets/icon";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import { Icon } from "@chakra-ui/react";
import { CircleXIcon } from "lucide-react";

// -----------------------------------------------------------------

interface FeedbackRetryProps extends FeedbackStateProps {
  onRetry?: () => void;
}

export default function FeedbackRetry(props: FeedbackRetryProps) {
  // Props
  const { title, description, icon, onRetry, children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();

  return (
    <StackV
      w={"fit"}
      m={"auto"}
      minH={MIN_H_FEEDBACK_CONTAINER}
      justify={"center"}
      {...restProps}
    >
      <FeedbackState
        icon={
          <Icon mb={title ? -2 : 0}>
            {icon || <LucideIcon icon={CircleXIcon} />}
          </Icon>
        }
        title={title ?? t.alert_retry.title}
        description={description ?? t.alert_retry.description}
        maxW={"300px"}
      />

      <StackV gap={1}>
        <Btn
          className={"clicky"}
          variant={"ghost"}
          colorPalette={themeContext.colorPalette}
          mx={"auto"}
          size={"sm"}
          onClick={onRetry}
        >
          {t.retry}
        </Btn>

        {children}
      </StackV>
    </StackV>
  );
}
