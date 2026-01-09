import { TooltipContentProps, useDisclosure } from "@chakra-ui/react";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import { ReactNode, useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";

interface Props extends Omit<TooltipContentProps, "content"> {
  children: ReactNode;
  content?: ReactNode;
}

const SimplePopover = (props: Props) => {
  // Props
  const { children, content, ...restProps } = props;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();

  useClickOutside([containerRef], onClose);

  return (
    <PopoverRoot open={open}>
      <PopoverTrigger asChild onClick={onOpen}>
        {children}
      </PopoverTrigger>

      <PopoverContent
        ref={containerRef}
        px={3}
        py={2}
        w={"full"}
        maxW={"280px !important"}
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

export default SimplePopover;
