import { StackH } from "@/components/ui/stack";
import { StackProps } from "@chakra-ui/react";
import React, { createContext, useContext, useRef } from "react";

// -----------------------------------------------------------------

interface GroupItemContextType {
  targetRef: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
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
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onClick?.(e);

    if (hasTarget && e.target === e.currentTarget && targetRef.current) {
      e.preventDefault();
      e.stopPropagation();
      targetRef.current.click();
    }
  };

  return (
    <GroupItemContext.Provider value={{ targetRef, disabled }}>
      <StackH
        align={"center"}
        justify={"space-between"}
        gap={4}
        p={4}
        pointerEvents={disabled ? "none" : "auto"}
        opacity={disabled ? 0.4 : 1}
        cursor={disabled ? "not-allowed" : clickable ? "pointer" : ""}
        transition={"200ms"}
        onClick={handleContainerClick}
        _hover={
          !disabled && clickable
            ? {
                bg: "bg.subtle",
              }
            : undefined
        }
        _active={
          !disabled && clickable
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

          const typedChild = child as React.ReactElement<any>;

          if (child.type === GroupItemTarget) {
            return child;
          }

          return React.cloneElement(typedChild, {
            style: {
              ...typedChild.props.style,
              pointerEvents: "none",
            },
          });
        })}
      </StackH>
    </GroupItemContext.Provider>
  );
};

// -----------------------------------------------------------------

interface GroupItemTargetProps {
  children: React.ReactElement<any & React.RefAttributes<any>>;
}

const GroupItemTarget = ({ children }: GroupItemTargetProps) => {
  const { targetRef, disabled } = useGroupItem();

  return React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      targetRef.current = node;

      const { ref } = children as any;
      if (typeof ref === "function") ref(node);
      else if (ref && "current" in ref) ref.current = node;
    },
    style: {
      ...children.props.style,
      pointerEvents: disabled ? "none" : "auto",
      cursor: disabled ? "not-allowed" : children.props.style?.cursor,
    },
  });
};

// -----------------------------------------------------------------

export const GroupItem = {
  Root: GroupItemRoot,
  Target: GroupItemTarget,
};
