import { Box, BoxProps } from "@chakra-ui/react";

export interface DividerProps extends BoxProps {
  dir?: "vertical" | "horizontal";
}
export const Divider = ({ dir = "horizontal", ...props }: DividerProps) => {
  switch (dir) {
    default:
      return <Box w={"1px"} h={"full"} bg={"border.subtle"} {...props} />;
    case "horizontal":
      return <Box w={"full"} h={"1px"} bg={"border.subtle"} {...props} />;
  }
};
