import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

interface Props extends StackProps {
  fRef?: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

export const HScroll = ({ fRef, children, ...props }: Props) => {
  const localRef = useRef<HTMLDivElement | null>(null);
  const hStackRef = (fRef ?? localRef) as React.RefObject<HTMLDivElement>;

  const scrollVelocity = useRef(0);
  const rafId = useRef<number | null>(null);

  // Helper to start smooth inertia scrolling if not already running
  const ensureRaf = (el: HTMLDivElement) => {
    if (rafId.current != null) return;
    const step = () => {
      if (!el) return;
      el.scrollLeft += scrollVelocity.current;
      // damping
      scrollVelocity.current *= 0.85;
      if (Math.abs(scrollVelocity.current) > 0.5) {
        rafId.current = requestAnimationFrame(step);
      } else {
        rafId.current = null;
      }
    };
    rafId.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const el = hStackRef.current;
    if (!el) return;

    // Prevent scroll-chaining to ancestors (avoid parent/page vertical scroll).
    // 'contain' will stop the chain but still allow internal scrolling.
    // You can use 'none' if you want stricter behavior.
    el.style.overscrollBehavior = "contain";

    const onWheel = (ev: WheelEvent) => {
      // If there's no overflow horizontally, don't interfere.
      const canScroll = el.scrollWidth > el.clientWidth;
      if (!canScroll) return;

      // Detect whether the user's intent is vertical (mostly Y) or horizontal gesture.
      const absX = Math.abs(ev.deltaX);
      const absY = Math.abs(ev.deltaY);
      const isVerticalIntent = absY > absX;

      if (!isVerticalIntent) {
        // let native horizontal gestures behave normally
        return;
      }

      // We're converting vertical wheel into horizontal scroll.
      // Prevent default so page/container doesn't scroll vertically.
      ev.preventDefault();
      ev.stopPropagation();

      // Normalize deltaMode: lines (1) vs pixels (0) vs page (2)
      let multiplier = 1;
      if (ev.deltaMode === 1)
        multiplier = 16; // approximate line height
      else if (ev.deltaMode === 2) multiplier = window.innerHeight; // page

      // Tweak this factor to taste for sensitivity / inertia
      scrollVelocity.current += ev.deltaY * 0.25 * multiplier;

      ensureRaf(el);
    };

    // Add native listener with { passive: false } so ev.preventDefault() works.
    el.addEventListener("wheel", onWheel, { passive: false });

    // Cleanup on unmount or ref change
    return () => {
      el.removeEventListener("wheel", onWheel as EventListener);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      // optional: reset overscrollBehavior
      el.style.overscrollBehavior = "";
    };
    // Intentionally depend on ref.current — reattach when element changes
  }, [hStackRef.current]);

  return (
    <CContainer
      ref={hStackRef}
      overflowY="hidden"
      w="full"
      className={`noScroll ${props.className ?? ""}`}
      {...props}
    >
      {children}
    </CContainer>
  );
};
