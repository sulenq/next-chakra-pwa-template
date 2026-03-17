"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { MContainer } from "@/components/widgets/m-container";
import { DesktopNavs } from "@/components/widgets/navs";
import {
  ContainerLayout,
  View,
  useViewContext,
} from "@/components/widgets/view";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { formatAbsDate } from "@/utils/formatter";
import { HStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

const NAVS =
  OTHER_PRIVATE_NAV_GROUPS[0].navs.find((n) => n.path === "/settings")
    ?.children || [];
const ROOT_PATH = `/settings`;

const PageScreen = ({ children }: { children: React.ReactNode }) => {
  // Hooks
  const pathname = usePathname();

  // Refs
  const { isSmContainer } = useViewContext();

  // Contexts
  const { t } = useLocale();

  // Derived Values
  const isAtSettingsIndexRoute = pathname === ROOT_PATH;
  const showSidebar =
    !isSmContainer || (isSmContainer && isAtSettingsIndexRoute);
  const showContent =
    !isSmContainer || (isSmContainer && !isAtSettingsIndexRoute);

  return (
    <HStack align={"stretch"} flex={1} gap={0} overflowY={"auto"}>
      {/* Sidebar */}
      {showSidebar && (
        <CContainer
          flexShrink={0}
          w={isSmContainer ? "full" : "250px"}
          h={"full"}
          maxH={"full"}
          py={R_SPACING_MD}
          // borderRight={isSmContainer ? "" : "1px solid"}
          borderColor={"border.muted"}
          overflowY={"auto"}
        >
          <View.Header title={t.settings} />

          <DesktopNavs
            navs={NAVS}
            addonElement={
              <CContainer mt={"auto"} gap={1}>
                <HelperText>{`v${APP.version}`}</HelperText>

                <HelperText>
                  {`Last updated: 
                ${formatAbsDate(APP.lastUpdated, t, {
                  variant: "numeric",
                })}`}
                </HelperText>
              </CContainer>
            }
            navsExpanded
            flex={1}
          />
        </CContainer>
      )}

      {/* Content */}
      {showContent && (
        <MContainer className={"scrollY"} p={R_SPACING_MD} flex={1}>
          <ContainerLayout
            flex={1}
            // maxW={""}
          >
            {pathname !== ROOT_PATH && <View.Header />}

            <CContainer flex={1}>{children}</CContainer>
          </ContainerLayout>
        </MContainer>
      )}
    </HStack>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <View.Container className={"settings-route-container"}>
      <PageScreen>{children}</PageScreen>
    </View.Container>
  );
}
