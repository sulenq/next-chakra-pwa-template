import { Text, TextProps } from "@chakra-ui/react";

export const HelperText = ({ children, ...restProps }: TextProps) => {
  return (
    <Text fontSize={"xs"} color={"fg.subtle"} {...restProps}>
      {children}
    </Text>
  );
};
