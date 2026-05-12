import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Box, StackProps } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface HScrollProps extends StackProps {
  children?: React.ReactNode;
  enableButtons?: boolean;
}

export const HScroll = forwardRef<HTMLDivElement, HScrollProps>(
  (props, ref) => {
    // Props
    const { children, enableButtons = true, ...restProps } = props;

    // Refs
    const localRef = useRef<HTMLDivElement | null>(null);
    const scrollVelocity = useRef(0);
    const rafId = useRef<number | null>(null);

    // States
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    // Utils
    const ensureRaf = (el: HTMLDivElement) => {
      if (rafId.current != null) return;
      const step = () => {
        if (!el) return;
        el.scrollLeft += scrollVelocity.current;
        // damping
        scrollVelocity.current *= 0.85;

        updateScrollState();

        if (Math.abs(scrollVelocity.current) > 0.5) {
          rafId.current = requestAnimationFrame(step);
        } else {
          rafId.current = null;
        }
      };
      rafId.current = requestAnimationFrame(step);
    };

    const updateScrollState = useCallback(() => {
      const el = localRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }, []);

    function setRefs(node: HTMLDivElement | null) {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;

      if (node) updateScrollState();
    }

    const scroll = (direction: "left" | "right") => {
      const el = localRef.current;
      if (!el) return;
      const amount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    };

    useEffect(() => {
      const el = localRef.current;
      if (!el) return;

      // Prevent scroll-chaining to ancestors (avoid parent/page vertical scroll).
      el.style.overscrollBehavior = "contain";

      const onWheel = (ev: WheelEvent) => {
        const canScroll = el.scrollWidth > el.clientWidth;
        if (!canScroll) return;

        const absX = Math.abs(ev.deltaX);
        const absY = Math.abs(ev.deltaY);
        const isVerticalIntent = absY > absX;

        if (!isVerticalIntent) return;

        ev.preventDefault();
        ev.stopPropagation();

        let multiplier = 1;
        if (ev.deltaMode === 1) multiplier = 16;
        else if (ev.deltaMode === 2) multiplier = window.innerHeight;

        scrollVelocity.current += ev.deltaY * 0.25 * multiplier;
        ensureRaf(el);
      };

      const onScroll = () => {
        updateScrollState();
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("scroll", onScroll);

      // Initial check
      updateScrollState();

      // Resize observer to check if buttons should show when window resizes
      const observer = new ResizeObserver(() => updateScrollState());
      observer.observe(el);

      return () => {
        el.removeEventListener("wheel", onWheel as EventListener);
        el.removeEventListener("scroll", onScroll);
        observer.disconnect();
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
        el.style.overscrollBehavior = "";
      };
    }, [updateScrollState]);

    return (
      <Box position={"relative"} w={"full"} role={"group"} {...restProps}>
        {enableButtons && showLeft && (
          <Box
            position={"absolute"}
            left={2}
            top={"50%"}
            transform={"translateY(-50%)"}
            zIndex={2}
          >
            <Btn
              iconButton
              size={"xs"}
              variant={"frosted"}
              rounded={"full"}
              boxShadow={"md"}
              onClick={() => scroll("left")}
            >
              <AppIconLucide icon={ChevronLeft} />
            </Btn>
          </Box>
        )}

        {enableButtons && showRight && (
          <Box
            position={"absolute"}
            right={2}
            top={"50%"}
            transform={"translateY(-50%)"}
            zIndex={2}
          >
            <Btn
              iconButton
              size={"xs"}
              variant={"frosted"}
              rounded={"full"}
              boxShadow={"md"}
              onClick={() => scroll("right")}
            >
              <AppIconLucide icon={ChevronRight} />
            </Btn>
          </Box>
        )}

        <CContainer
          ref={setRefs}
          overflowY={"hidden"}
          w={"full"}
          className={`noScroll ${restProps.className ?? ""}`}
        >
          {children}
        </CContainer>
      </Box>
    );
  },
);

HScroll.displayName = "HScroll";
