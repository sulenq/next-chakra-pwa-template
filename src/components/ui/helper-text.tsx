import { P, PProps } from "@/components/ui/p";

// -----------------------------------------------------------------

export const HelperText = ({ children, ...restProps }: PProps) => {
  return (
    <P fontSize={"sm"} color={"fg.subtle"} lineHeight={1.2} {...restProps}>
      {children}
    </P>
  );
};
