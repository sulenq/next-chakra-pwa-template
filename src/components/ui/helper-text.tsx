import { P } from "@/components/ui/p";
import { TextProps } from "@chakra-ui/react";

export const HelperText = ({ children, ...restProps }: TextProps) => {
  return (
    <P fontSize={"sm"} color={"fg.subtle"} {...restProps}>
      {children}
    </P>
  );
};
