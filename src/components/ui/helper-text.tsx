import { Text, TextProps } from "@chakra-ui/react";

export const HelperText = ({ children, ...restProps }: TextProps) => {
  return (
    <Text fontSize={"sm"} color={"fg.subtle"} {...restProps}>
      {children}
    </Text>
  );
};
