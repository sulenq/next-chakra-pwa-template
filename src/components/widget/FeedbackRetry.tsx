"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon, StackProps } from "@chakra-ui/react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { EmptyState } from "../ui/empty-state";
import { CContainer } from "@/components/ui/c-container";
import useLang from "@/context/useLang";
import { Btn } from "@/components/ui/btn";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";

interface Props extends StackProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function FeedbackRetry({
  title,
  description,
  onRetry,
  ...props
}: Props) {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      minH={MIN_H_FEEDBACK_CONTAINER}
      justify={"center"}
      {...props}
    >
      <EmptyState
        icon={
          <Icon>
            <IconAlertTriangle />
          </Icon>
        }
        title={title || l.alert_retry.title}
        description={description || l.alert_retry.description}
        maxW={"300px"}
      >
        <Btn
          className="clicky"
          colorPalette={themeConfig.colorPalette}
          onClick={onRetry}
        >
          {l.retry}
        </Btn>
      </EmptyState>
    </CContainer>
  );
}
