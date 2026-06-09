import { StackH } from "@/components/ui/stack";
import { StackProps } from "@chakra-ui/react";
import React, { createContext, useContext, useRef } from "react";

// -----------------------------------------------------------------

interface GroupItemContextType {
  targetRef: React.RefObject<HTMLElement | null>;
}

const GroupItemContext = createContext<GroupItemContextType | null>(null);

const useGroupItem = () => {
  const context = useContext(GroupItemContext);
  if (!context) {
    throw new Error(
      "GroupItem sub-components must be used within a GroupItem.Root",
    );
  }
  return context;
};

// -----------------------------------------------------------------

interface GroupItemTargetProps {
  children: React.ReactElement<any & React.RefAttributes<any>>;
}

const GroupItemTarget = ({ children }: GroupItemTargetProps) => {
  const { targetRef } = useGroupItem();

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

interface GroupItemRootProps extends StackProps {
  disabled?: boolean;
  clickable?: boolean;
}

const GroupItemRoot = ({
  children,
  disabled,
  clickable = true,
  onClick,
  ...props
}: GroupItemRootProps) => {
  const targetRef = useRef<HTMLElement | null>(null);

  const hasTarget = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === GroupItemTarget,
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
    <GroupItemContext.Provider value={{ targetRef }}>
      <StackH
        align={"center"}
        justify={"space-between"}
        gap={4}
        p={4}
        pointerEvents={disabled ? "none" : "auto"}
        opacity={disabled ? 0.4 : 1}
        cursor={clickable ? "pointer" : ""}
        transition={"200ms"}
        onClick={handleContainerClick}
        _hover={
          clickable
            ? {
                bg: "bg.subtle",
              }
            : undefined
        }
        _active={
          clickable
            ? {
                bg: "bg.muted",
              }
            : undefined
        }
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          if (!hasTarget) return child;

          if (child.type === GroupItemTarget) {
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
    </GroupItemContext.Provider>
  );
};

// -----------------------------------------------------------------

export const GroupItem = {
  Root: GroupItemRoot,
  Target: GroupItemTarget,
};
