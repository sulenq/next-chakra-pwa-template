"use client";

import { useRef, useState, useEffect } from "react";
import { Btn, Props__Btn } from "@/components/ui/btn";

type DefaultPos = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type AllowedSnap = ("left" | "right")[];

interface Props extends Props__Btn {
  children: React.ReactNode;
  defaultPos?: DefaultPos;
  allowedSnap?: AllowedSnap;
}

export const DraggableBtn = (props: Props) => {
  const {
    children,
    defaultPos = "bottom-left",
    allowedSnap = ["left", "right"],
    onClick,
    ...restProps
  } = props;

  const btnRef = useRef<HTMLButtonElement>(null);

  const [pos, setPos] = useState({ x: 16, y: 16 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [moved, setMoved] = useState(false); // track if actually dragged

  // set initial position
  useEffect(() => {
    const setInitialPos = () => {
      if (!btnRef.current) return;
      const { offsetWidth, offsetHeight } = btnRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const positions = {
        "top-left": { x: 16, y: 16 },
        "top-right": { x: vw - offsetWidth - 16, y: 16 },
        "bottom-left": { x: 16, y: vh - offsetHeight - 16 },
        "bottom-right": { x: vw - offsetWidth - 16, y: vh - offsetHeight - 16 },
      };

      setPos(positions[defaultPos]);
    };

    setInitialPos();
    window.addEventListener("resize", setInitialPos);
    return () => window.removeEventListener("resize", setInitialPos);
  }, [defaultPos]);

  // drag logic + snapping
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;

      // detect minimal movement (to block click later)
      const dx = e.movementX;
      const dy = e.movementY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        setMoved(true);
      }

      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseUp = () => {
      if (!btnRef.current) return;
      if (!dragging) return;

      setDragging(false);

      const rect = btnRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let snapX = pos.x;

      // horizontal snap
      if (allowedSnap.includes("left") && allowedSnap.includes("right")) {
        snapX = rect.left < vw / 2 ? 16 : vw - rect.width - 16;
      } else if (allowedSnap.includes("left")) {
        snapX = 16;
      } else if (allowedSnap.includes("right")) {
        snapX = vw - rect.width - 16;
      }

      const snapY = Math.min(Math.max(16, rect.top), vh - rect.height - 16);

      setPos({ x: snapX, y: snapY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset, allowedSnap, pos]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setDragging(true);
    setMoved(false); // reset moved flag
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleClick = (e: React.MouseEvent) => {
    // ignore click if drag occurred
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e as any);
  };

  return (
    <Btn
      ref={btnRef}
      pos="fixed"
      zIndex={99}
      style={{
        left: pos.x,
        top: pos.y,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        transition: dragging ? "none" : "all 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </Btn>
  );
};
