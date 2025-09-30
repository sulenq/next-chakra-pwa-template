"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widget/FeedbackState";
import { Props__FeedbackState } from "@/constants/props";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon } from "@chakra-ui/react";
import { IconAlertTriangle } from "@tabler/icons-react";

interface Props extends Props__FeedbackState {
  onRetry?: () => void;
}

export default function FeedbackRetry(props: Props) {
  // Props
  const { title, description, icon, onRetry, children, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

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
            {icon || <IconAlertTriangle stroke={1.8} />}
          </Icon>
        }
        title={title ?? l.alert_retry.title}
        description={description ?? l.alert_retry.description}
        maxW={"300px"}
      />

      <Btn
        className="clicky"
        variant={"outline"}
        colorPalette={themeConfig.colorPalette}
        onClick={onRetry}
      >
        {l.retry}
      </Btn>

      {children}
    </CContainer>
  );
}
