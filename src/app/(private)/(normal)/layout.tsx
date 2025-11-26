"use client";

import { Props__Layout } from "@/constants/props";

export default function Layout(props: Props__Layout) {
  // Props
  const { children } = props;

  return (
    <>
      {/* <TopBar /> */}

      {children}
    </>
  );
}
