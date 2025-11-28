import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  borderless?: boolean;
  withUtils?: boolean;
}
export const ItemHeaderContainer = ({
  children,
  borderless = false,
  withUtils = false,
  ...restProps
}: Props) => {
  return (
    <HStack
      h={"50px"}
      p={1}
      pl={4}
      pr={withUtils ? 2 : 4}
      gap={4}
      wrap={"wrap"}
      borderBottom={"1px solid"}
      borderColor={borderless ? "transparent" : "border.subtle"}
      justify={"space-between"}
      {...restProps}
    >
      {children}
    </HStack>
  );
};
