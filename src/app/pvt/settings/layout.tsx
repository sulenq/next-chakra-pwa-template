"use client";

import { AppSettingsLayout as AppSettingsLayoutComponent } from "@/components/widget/AppSettingsLayout";

interface Props {
  children: React.ReactNode;
}

const AppSettingsLayout = (props: Props) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <AppSettingsLayoutComponent id="settings_container" {...restProps}>
      {children}
    </AppSettingsLayoutComponent>
  );
};
export default AppSettingsLayout;
