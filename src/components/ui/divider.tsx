import { Props__Divider } from "@/constants/props";
import { Box } from "@chakra-ui/react";

export const Divider = ({ dir = "horizontal", ...props }: Props__Divider) => {
  switch (dir) {
    default:
      return <Box w={"1px"} h={"full"} bg={"d2"} {...props} />;
    case "horizontal":
      return <Box w={"full"} h={"1px"} bg={"d2"} {...props} />;
  }
};
