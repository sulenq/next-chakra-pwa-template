import { StackH } from "@/components/ui/stack";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface ToggleSettingContainerProps extends StackProps {
  disabled?: boolean;
}

export const SettingItemContainer = ({
  children,
  disabled,
  ...props
}: ToggleSettingContainerProps) => {
  return (
    <StackH
      align={"center"}
      justify={"space-between"}
      gap={4}
      p={4}
      pointerEvents={disabled ? "none" : "auto"}
      opacity={disabled ? 0.4 : 1}
      overflow={"clip"}
      transition={"200ms"}
      _hover={{
        bg: "bg.subtle",
      }}
      {...props}
    >
      {children}
    </StackH>
  );
};
