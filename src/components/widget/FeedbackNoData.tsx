"use client";

import useLang from "@/context/useLang";
import { Icon, StackProps } from "@chakra-ui/react";
import { IconDatabaseOff } from "@tabler/icons-react";
import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "./FeedbackState";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";

interface Props extends StackProps {
  title?: string;
  description?: string;
  icon?: any;
}

export default function FeedbackNoData({
  title,
  description,
  icon,
  children,
  ...props
}: Props) {
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
      {...props}
    >
      <FeedbackState
        icon={<Icon mb={title ? -2 : 0}>{icon || <IconDatabaseOff />}</Icon>}
        title={title ?? l.alert_no_data.title}
        description={description ?? l.alert_no_data.description}
        maxW={"300px"}
      />

      {children}
    </CContainer>
  );
}
