import { HStack, StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface ToggleSettingContainerProps extends StackProps {
  disabled?: boolean;
}

export const ToggleSettingContainer = ({
  children,
  disabled,
  ...props
}: ToggleSettingContainerProps) => {
  return (
    <HStack
      justify={"space-between"}
      pointerEvents={disabled ? "none" : "auto"}
      opacity={disabled ? 0.4 : 1}
      {...props}
    >
      {children}
    </HStack>
  );
};
