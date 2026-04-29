"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/widgets/feedback-state";
import { LucideIcon } from "@/components/widgets/icon";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
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
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
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

      <CContainer gap={1}>
        <Btn
          className={"clicky"}
          variant={"ghost"}
          colorPalette={themeConfig.colorPalette}
          mx={"auto"}
          size={"sm"}
          onClick={onRetry}
        >
          {t.retry}
        </Btn>

        {children}
      </CContainer>
    </CContainer>
  );
}
