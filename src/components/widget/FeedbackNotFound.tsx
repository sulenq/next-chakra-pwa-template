"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widget/FeedbackState";
import { Props__FeedbackState } from "@/constants/props";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { Icon } from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";

export default function FeedbackNotFound(props: Props__FeedbackState) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Hooks
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
          <Icon mb={title ? -2 : 0}>{icon || <IconSearch stroke={1.8} />}</Icon>
        }
        title={title ?? l.alert_not_found.title}
        description={description ?? l.alert_not_found.description}
        maxW={"300px"}
      />

      {children}
    </CContainer>
  );
}
