import { P, PProps } from "@/components/ui/p";
import { R_SPACING_MD } from "@/constants/styles";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const HelperText = (props: PProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <P fontSize={"sm"} color={"fg.subtle"} {...restProps}>
      {children}
    </P>
  );
};

// -----------------------------------------------------------------

export const SettingsGroupTitle = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <P
      // px={4}
      py={R_SPACING_MD}
      fontSize={"md"}
      fontWeight={"semibold"}
      mb={[2, null, 0]}
      {...restProps}
    >
      {children}
    </P>
  );
};

// -----------------------------------------------------------------

export const SettingsHelperText = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HelperText
      // px={4}
      mt={2}
      {...restProps}
    >
      {children}
    </HelperText>
  );
};

// -----------------------------------------------------------------
