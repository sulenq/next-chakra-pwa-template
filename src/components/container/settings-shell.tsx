import { StackH } from "@/components/ui/stack";
import { StackProps } from "@chakra-ui/react";
import React, { createContext, useContext, useRef } from "react";

// -----------------------------------------------------------------

interface SettingItemContextType {
  targetRef: React.RefObject<HTMLElement | null>;
}

const SettingItemContext = createContext<SettingItemContextType | null>(null);

const useSettingItem = () => {
  const context = useContext(SettingItemContext);
  if (!context) {
    throw new Error(
      "SettingItem sub-components must be used within a SettingItem.Root",
    );
  }
  return context;
};

// -----------------------------------------------------------------

interface SettingItemTargetProps {
  children: React.ReactElement<any & React.RefAttributes<any>>;
}

const SettingItemTarget = ({ children }: SettingItemTargetProps) => {
  const { targetRef } = useSettingItem();

  return React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      targetRef.current = node;

      const { ref } = children as any;
      if (typeof ref === "function") ref(node);
      else if (ref && "current" in ref) ref.current = node;
    },
    style: {
      ...children.props.style,
      pointerEvents: "auto",
    },
  });
};

// -----------------------------------------------------------------

interface SettingItemRootProps extends StackProps {
  disabled?: boolean;
  hoverable?: boolean;
}

const SettingItemRoot = ({
  children,
  disabled,
  hoverable = true,
  onClick,
  ...props
}: SettingItemRootProps) => {
  const targetRef = useRef<HTMLElement | null>(null);

  const hasTarget = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === SettingItemTarget,
  );

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);

    if (hasTarget && e.target === e.currentTarget && targetRef.current) {
      e.preventDefault();
      e.stopPropagation();
      targetRef.current.click();
    }
  };

  return (
    <SettingItemContext.Provider value={{ targetRef }}>
      <StackH
        align={"center"}
        justify={"space-between"}
        gap={4}
        p={4}
        pointerEvents={disabled ? "none" : "auto"}
        opacity={disabled ? 0.4 : 1}
        cursor={hoverable ? "pointer" : ""}
        transition={"200ms"}
        onClick={handleContainerClick}
        _hover={
          hoverable
            ? {
                bg: "bg.subtle",
              }
            : undefined
        }
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          if (!hasTarget) return child;

          if (child.type === SettingItemTarget) {
            return child;
          }

          return React.cloneElement(child as React.ReactElement<any>, {
            style: {
              ...(child.props as any).style,
              pointerEvents: "none",
            },
          });
        })}
      </StackH>
    </SettingItemContext.Provider>
  );
};

// -----------------------------------------------------------------

export const SettingItem = {
  Root: SettingItemRoot,
  Target: SettingItemTarget,
};
