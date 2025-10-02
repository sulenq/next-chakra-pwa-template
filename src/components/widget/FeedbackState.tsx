"use client";

import { P } from "@/components/ui/p";
import { Icon, StackProps, VStack } from "@chakra-ui/react";
import { IconDatabaseOff } from "@tabler/icons-react";

interface Props extends StackProps {
  icon?: any;
  title?: any;
  description?: any;
}

const FeedbackState = (props: Props) => {
  // Props
  const { icon, title, description, children, ...restProps } = props;

  // States
  const titleString = typeof title === "string";
  const descriptionString = typeof description === "string";

  return (
    <VStack gap={1} p={4} {...restProps}>
      <Icon mb={2} color={"fg.subtle"} boxSize={9}>
        {icon || <IconDatabaseOff stroke={1.8} />}
      </Icon>

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
    </VStack>
  );
};

export default FeedbackState;
