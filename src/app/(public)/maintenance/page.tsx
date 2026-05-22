"use client";

import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { BrandWatermark } from "@/components/branding/brand-watermark";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";

export default function MaintenanceRoute() {
  // Store
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  return (
    <StackV h={"100vh"} gap={0}>
      <StackV p={8} flex={1} justify={"center"} gap={4} w={"full"}>
        <StackH align={"center"}>
          <Divider dir={"vertical"} w={"20px"} h={"2px"} />
          <P fontWeight={"bold"} fontSize={"lg"} color={"fg.subtle"}>
            503
          </P>
          <Divider dir={"vertical"} w={"20px"} h={"2px"} />
        </StackH>

        <P textAlign={"center"} fontSize={"xl"} fontWeight={"bold"}>
          Maintenance
        </P>

        <P textAlign={"center"} mb={4} maxW={"450px"} color={"fg.subtle"}>
          {t.maintenance_route.description}
        </P>

        <NavLink to={"/"} w={"fit"}>
          <Btn colorPalette={theme.colorPalette} px={8}>
            {t.main_page}
          </Btn>
        </NavLink>
      </StackV>

      <StackV w={"full"} py={4}>
        <BrandWatermark />
      </StackV>
    </StackV>
  );
}
