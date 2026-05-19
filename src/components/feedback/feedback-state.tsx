"use client";

import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { Icon, StackProps } from "@chakra-ui/react";
import { CircleXIcon } from "lucide-react";

// -----------------------------------------------------------------

export interface FeedbackStateProps extends StackProps {
  icon?: any;
  title?: any;
  description?: any;
}

const FeedbackState = (props: FeedbackStateProps) => {
  // Props
  const { icon, title, description, children, ...restProps } = props;

  // States
  const titleString = typeof title === "string";
  const descriptionString = typeof description === "string";

  return (
    <StackV align={"center"} gap={1} p={4} {...restProps}>
      {icon && (
        <Icon mb={2} color={"fg.subtle"} boxSize={9}>
          {icon || <CircleXIcon />}
        </Icon>
      )}

      {titleString && (
        <P textAlign={"center"} fontWeight={"semibold"}>
          {title}
        </P>
      )}

      {!titleString && title}

      {descriptionString && (
        <P maxW={"300px"} textAlign={"center"} color={"fg.subtle"}>
          {description}
        </P>
      )}

      {!descriptionString && description}

      {children}
    </StackV>
  );
};

export default FeedbackState;
