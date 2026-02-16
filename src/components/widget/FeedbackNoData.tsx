"use client";

import { CContainer } from "@/components/ui/c-container";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__FeedbackState } from "@/constants/props";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import useLang from "@/context/useLang";
import { Icon } from "@chakra-ui/react";
import { ServerOff } from "lucide-react";
import FeedbackState from "./FeedbackState";

export default function FeedbackNoData(props: Props__FeedbackState) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      align={"center"}
      minH={MIN_H_FEEDBACK_CONTAINER}
      justify={"center"}
      gap={4}
      {...restProps}
    >
      <FeedbackState
        icon={
          <Icon mb={title ? -2 : 0}>
            {icon || <LucideIcon icon={ServerOff} />}
          </Icon>
        }
        title={title ?? l.alert_no_data.title}
        description={description ?? l.alert_no_data.description}
        maxW={"300px"}
      />

      {children}
    </CContainer>
  );
}
