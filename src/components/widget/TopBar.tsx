import { ColorModeButton } from "@/components/ui/color-mode";
import { P } from "@/components/ui/p";
import BackButton from "@/components/widget/BackButton";
import Clock from "@/components/widget/Clock";
import { DotIndicator } from "@/components/widget/Indicator";
import { Today } from "@/components/widget/Today";
import { APP } from "@/constants/_meta";
import { Interface__NavListItem } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import useScreen from "@/hooks/useScreen";
import { last } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack, Icon } from "@chakra-ui/react";
import { IconSlash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

const FONT_SIZE = "md";

export const NavBreadcrumb = (props: any) => {
  // Props
  const { backPath, resolvedActiveNavs, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  return (
    <HStack ml={backPath ? "-4px" : ""} {...restProps}>
      {backPath && <BackButton iconButton clicky={false} backPath={backPath} />}

      <HStack color={"fg.subtle"} gap={0}>
        <P fontSize={FONT_SIZE}>{APP.name}</P>

        <Icon boxSize={5} color={"d4"}>
          <IconSlash stroke={1.5} />
        </Icon>

        {resolvedActiveNavs.map((nav: Interface__NavListItem, idx: number) => {
          return (
            <HStack key={idx} gap={0} color={"fg.subtle"}>
              {idx !== 0 && (
                <>
                  {backPath && (
                    <Icon boxSize={5} color={"d4"}>
                      <IconSlash stroke={1.5} />
                    </Icon>
                  )}

                  {!backPath && <DotIndicator color={"d4"} mx={2} />}
                </>
              )}

              <P fontSize={FONT_SIZE} lineClamp={1}>
                {pluckString(l, nav.labelKey)}
              </P>
            </HStack>
          );
        })}
      </HStack>
    </HStack>
  );
};

export const TopBar = () => {
  // Hooks
  const { sw } = useScreen();
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
  const resolvedActiveNavs =
    sw < 960 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;

  return (
    <HStack
      gap={4}
      h={"52px"}
      p={4}
      justify={"space-between"}
      bg={"body"}
      borderBottom={"1px solid"}
      borderColor={"border.muted"}
    >
      <NavBreadcrumb
        backPath={backPath}
        resolvedActiveNavs={resolvedActiveNavs}
      />

      <HStack flexShrink={0} gap={1}>
        <HStack mx={1}>
          <Clock fontSize={FONT_SIZE} />

          <Today fontSize={FONT_SIZE} />
        </HStack>

        <ColorModeButton rounded={"full"} size={"xs"} />
      </HStack>
    </HStack>
  );
};
