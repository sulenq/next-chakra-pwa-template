"use client";

import { Icon, StackProps } from "@chakra-ui/react";
import { IconBan } from "@tabler/icons-react";
import { EmptyState } from "../ui/empty-state";
import { CContainer } from "@/components/ui/c-container";
import useLang from "@/context/useLang";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";

interface Props extends StackProps {
  title?: string;
  description?: string;
}

export default function FeedbackForbidden({
  title,
  description,
  ...props
}: Props) {
  // Hooks
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      align={"center"}
      minH={MIN_H_FEEDBACK_CONTAINER}
      justify={"center"}
      {...props}
    >
      <EmptyState
        icon={
          <Icon>
            <IconBan />
          </Icon>
        }
        title={title || l.alert_forbidden.title}
        description={description || l.alert_forbidden.description}
        maxW={"300px"}
      />
    </CContainer>
  );
}
