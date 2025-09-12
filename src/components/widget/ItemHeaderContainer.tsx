import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  borderless?: boolean;
  clearSpacing?: boolean;
}
export const ItemHeaderContainer = ({
  children,
  borderless = false,
  // clearSpacing = false,
  ...restProps
}: Props) => {
  return (
    <HStack
      borderBottom={"1px solid"}
      borderColor={borderless ? "transparent" : "border.muted"}
      justify={"space-between"}
      wrap={"wrap"}
      px={4}
      py={3}
      gap={4}
      {...restProps}
    >
      {children}
    </HStack>
  );
};
