import { Box, BoxProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export interface DividerProps extends BoxProps {
  dir?: "vertical" | "horizontal";
}

export const Divider = ({ dir = "horizontal", ...props }: DividerProps) => {
  switch (dir) {
    case "horizontal":
      return (
        <Box
          flexShrink={0}
          w={"full"}
          h={"1px"}
          bg={"border.muted"}
          {...props}
        />
      );
    case "vertical":
      return (
        <Box
          flexShrink={0}
          w={"1px"}
          h={"full"}
          bg={"border.muted"}
          {...props}
        />
      );
  }
};
