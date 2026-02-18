import {
  PopoverRootProps,
  TooltipContentProps,
  useDisclosure,
} from "@chakra-ui/react";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import { ReactNode, useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { useThemeConfig } from "@/context/useThemeConfig";

interface Props extends Omit<TooltipContentProps, "content"> {
  children: ReactNode;
  content?: ReactNode;
  rootProps?: Omit<PopoverRootProps, "children">;
}

const SimplePopover = (props: Props) => {
  // Props
  const { children, content, rootProps, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside([containerRef], onClose);

  return (
    <PopoverRoot open={open} {...rootProps}>
      <PopoverTrigger asChild onClick={onOpen}>
        {children}
      </PopoverTrigger>

      <PopoverContent
        ref={containerRef}
        w={"fit"}
        maxW={"240px"}
        px={2}
        py={1}
        rounded={themeConfig.radii.component}
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
