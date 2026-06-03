"use client";

import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { BrandWatermark } from "@/components/branding/brand-watermark";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";

export default function NotFoundRoute() {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  return (
    <StackV h={"100vh"} gap={0}>
      <StackV
        flex={1}
        align={"center"}
        justify={"center"}
        gap={4}
        w={"full"}
        p={8}
      >
        <StackH align={"center"}>
          <Divider dir={"vertical"} w={"20px"} h={"2px"} />
          <P fontWeight={"bold"} fontSize={"lg"} color={"fg.subtle"}>
            404
          </P>
          <Divider dir={"vertical"} w={"20px"} h={"2px"} />
        </StackH>

        <P textAlign={"center"} fontSize={"xl"} fontWeight={"bold"}>
          Page Not Found
        </P>

        <P textAlign={"center"} mb={4} maxW={"450px"} color={"fg.subtle"}>
          {t.missing_route.description}
        </P>

        <NavLink to={"/"} w={"fit"}>
          <Btn colorPalette={theme.colorPalette}>{t.main_page}</Btn>
        </NavLink>
      </StackV>

      <StackV w={"full"} py={4}>
        <BrandWatermark />
      </StackV>
    </StackV>
  );
}
