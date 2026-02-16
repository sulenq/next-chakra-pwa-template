"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__FeedbackState } from "@/constants/props";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon } from "@chakra-ui/react";
import { CircleXIcon } from "lucide-react";

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
            {icon || <LucideIcon icon={CircleXIcon} />}
          </Icon>
        }
        title={title ?? l.alert_retry.title}
        description={description ?? l.alert_retry.description}
        maxW={"300px"}
      />

      <CContainer gap={1} pb={4}>
        <Btn
          className="clicky"
          variant={"outline"}
          colorPalette={themeConfig.colorPalette}
          mx={"auto"}
          size={"sm"}
          onClick={onRetry}
        >
          {l.retry}
        </Btn>

        {children}
      </CContainer>
    </CContainer>
  );
}
