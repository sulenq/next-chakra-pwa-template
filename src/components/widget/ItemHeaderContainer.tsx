import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  borderless?: boolean;
  withUtils?: boolean;
}
export const ItemHeaderContainer = ({
  children,
  borderless = true,
  withUtils = false,
  ...restProps
}: Props) => {
  return (
    <HStack
      h={"46px"}
      p={1}
      pl={4}
      pr={withUtils ? "6px" : 4}
      gap={4}
      wrap={"wrap"}
      borderBottom={"1px solid"}
      borderColor={borderless ? "transparent" : "border.muted"}
      justify={"space-between"}
      {...restProps}
    >
      {children}
    </HStack>
  );
};
