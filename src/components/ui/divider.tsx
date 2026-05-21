import { Box, BoxProps } from "@chakra-ui/react";

export interface DividerProps extends BoxProps {
  dir?: "vertical" | "horizontal";
}

export const Divider = ({
  dir = "horizontal",
  mx,
  my,
  m,
  ...props
}: DividerProps) => {
  const hasHorizontalMargin =
    mx !== undefined || (typeof m === "number" && m > 0);
  const hasVerticalMargin =
    my !== undefined || (typeof m === "number" && m > 0);

  if (dir === "horizontal") {
    return (
      <Box
        flexShrink={0}
        w={hasHorizontalMargin ? "auto" : "full"}
        h="1px"
        mx={mx}
        my={my}
        m={m}
        bg={"border.subtle"}
        {...props}
      />
    );
  }

  return (
    <Box
      flexShrink={0}
      h={hasVerticalMargin ? "auto" : "full"}
      w="1px"
      mx={mx}
      my={my}
      m={m}
      bg={"border.subtle"}
      {...props}
    />
  );
};
