import { AppIconLucide } from "@/components/branding/app-icon";
import { Btn } from "@/components/ui/btn";
import { NavLink } from "@/components/ui/nav-link";
import { StackH, StackV } from "@/components/ui/stack";
import { UserIdCard } from "@/components/user/user-id-card";
import { WELCOME_ROUTE } from "@/constants/routes";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { ArrowRightIcon } from "lucide-react";

export const SignedinState = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  return (
    <StackV align={"center"} gap={8} w={"220px"} m={"auto"}>
      <UserIdCard maskingTop={"8px"} withSignoutButton maxW={"180px"} />

      <StackH gap={2} justify={"center"}>
        {/* TODO_DEV: Remove below component in real dev */}
        <>
          <NavLink to={"/test"} mx={"auto"}>
            <Btn variant={"ghost"} colorPalette={theme.colorPalette}>
              Test
            </Btn>
          </NavLink>

          <NavLink to={"/demo"} mx={"auto"}>
            <Btn variant={"ghost"} colorPalette={theme.colorPalette}>
              Demo
            </Btn>
          </NavLink>
        </>

        <NavLink to={WELCOME_ROUTE}>
          <Btn variant={"ghost"} colorPalette={theme.colorPalette}>
            {t.enter_app} <AppIconLucide icon={ArrowRightIcon} />
          </Btn>
        </NavLink>
      </StackH>
    </StackV>
  );
};
