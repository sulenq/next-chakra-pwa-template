"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";

import { Tooltip } from "@/components/ui/tooltip";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { Icon, MenuPositioner, Portal } from "@chakra-ui/react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

// -----------------------------------------------------------------

const LANGUAGES = [
  {
    key: "id",
    code: "id-ID",
    label: "Indonesia",
  },
  {
    key: "en",
    code: "en-US",
    label: "English",
  },
];

// -----------------------------------------------------------------

export const LangMenu = (props: BtnProps) => {
  // Contexts
  const { t, locale, setLocale } = useLocale();
  const { themeConfig } = useThemeConfig();

  return (
    <Tooltip content={t.language}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Btn
            clicky={false}
            w={"60px"}
            px={2}
            pr={1}
            variant={"ghost"}
            color={"current"}
            size={"sm"}
            {...props}
          >
            {locale.toUpperCase()}
            <IconChevronDown stroke={1.5} />
          </Btn>
        </Menu.Trigger>

        <Portal>
          <MenuPositioner>
            <Menu.Content zIndex={2000}>
              {LANGUAGES.map((item, i) => {
                const active = item.key === locale;

                return (
                  <Menu.Item
                    key={i}
                    value={item.key}
                    onClick={() => setLocale(item.key as any)}
                    fontWeight={active ? "medium" : "normal"}
                  >
                    {item.label}

                    {active && (
                      <Icon
                        boxSize={5}
                        color={themeConfig.primaryColor}
                        ml={"auto"}
                      >
                        <IconCheck stroke={1.5} />
                      </Icon>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Content>
          </MenuPositioner>
        </Portal>
      </Menu.Root>
    </Tooltip>
  );
};
