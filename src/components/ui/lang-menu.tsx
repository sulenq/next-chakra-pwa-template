"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";

import { Tooltip } from "@/components/ui/tooltip";
import { LANGUAGES } from "@/constants/languages";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { MenuPositioner, Portal } from "@chakra-ui/react";
import { IconChevronDown } from "@tabler/icons-react";
import { RadioItem } from "./radio";

// -----------------------------------------------------------------

export const LangMenu = (props: BtnProps) => {
  // Stores
  const { t, locale, setLocale } = useLocaleStore();

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
                const isSelected = item.key === locale;

                return (
                  <Menu.Item
                    key={i}
                    value={item.key}
                    onClick={() => setLocale(item.key as any)}
                    fontWeight={isSelected ? "medium" : "normal"}
                  >
                    <RadioItem checked={isSelected} />

                    {item.label}
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
