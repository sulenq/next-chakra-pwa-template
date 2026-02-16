import { EmptyState as ChakraEmptyState, VStack } from "@chakra-ui/react";
import { forwardRef } from "react";
import { P } from "./p";

export interface EmptyStateProps extends ChakraEmptyState.RootProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const { title, description, icon, children, ...rest } = props;
    return (
      <ChakraEmptyState.Root ref={ref} p={0} {...rest}>
        <ChakraEmptyState.Content gap={4}>
          {icon && (
            <ChakraEmptyState.Indicator>{icon}</ChakraEmptyState.Indicator>
          )}
          <VStack textAlign="center">
            {title && (
              <P fontSize={"lg"} fontWeight={"medium"}>
                {title}
              </P>
            )}
            {description && <P color={"fg.subtle"}>{description}</P>}
          </VStack>
          {children}
        </ChakraEmptyState.Content>
      </ChakraEmptyState.Root>
    );
  }
);
