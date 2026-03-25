import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  PopoverRootProps,
  TooltipContentProps,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, useRef } from "react";

interface ToggleTipProps extends Omit<TooltipContentProps, "content"> {
  children: ReactNode;
  content?: ReactNode;
  rootProps?: Omit<PopoverRootProps, "children">;
}
const ToggleTip = (props: ToggleTipProps) => {
  // Props
  const { children, content, rootProps, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<any>(null);

  useClickOutside([containerRef, triggerRef], onClose);

  return (
    <PopoverRoot open={open} {...rootProps}>
      <PopoverTrigger asChild onClick={onOpen} ref={triggerRef}>
        {children}
      </PopoverTrigger>

      <PopoverContent
        ref={containerRef}
        w={"fit"}
        maxW={"240px"}
        px={2}
        py={1}
        lineHeight={"normal"}
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...restProps}
      >
        {content}
      </PopoverContent>
    </PopoverRoot>
  );
};

export default ToggleTip;
