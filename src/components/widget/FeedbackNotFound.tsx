"use client";

import { Icon, StackProps } from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { EmptyState } from "../ui/empty-state";
import { CContainer } from "@/components/ui/c-container";
import useLang from "@/context/useLang";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";

interface Props extends StackProps {
  title?: string;
  description?: string;
  children?: any;
}

export default function FeedbackNotFound({
  title,
  description,
  children,
  ...props
}: Props) {
  // Hooks
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
          <Icon mb={title ? -2 : 0}>
            <IconSearch />
          </Icon>
        }
        title={title || l.alert_not_found.title}
        description={description || l.alert_not_found.description}
        maxW={"300px"}
      >
        {children}
      </EmptyState>
    </CContainer>
  );
}
