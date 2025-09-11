"use client";

import { AppLayout as AppLayoutComponent } from "@/components/widget/AppLayout";

interface Props {
  children: React.ReactNode;
}

const AppLayout = (props: Props) => {
  // Props
  const { children, ...restProps } = props;

  return <AppLayoutComponent {...restProps}>{children}</AppLayoutComponent>;
};
export default AppLayout;
