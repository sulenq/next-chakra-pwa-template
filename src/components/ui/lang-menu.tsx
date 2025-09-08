"use client";

import { ButtonProps, Icon, MenuPositioner, Portal } from "@chakra-ui/react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import useLang from "../../context/useLang";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./menu";
import { Tooltip } from "./tooltip";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Btn } from "./btn";

interface Props extends ButtonProps {}

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

export const LangMenu = ({ ...props }: Props) => {
  // Contexts
  const { l, lang, setLang } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <Tooltip content={l.language}>
      <MenuRoot>
        <MenuTrigger asChild>
          <Btn
            clicky={false}
            px={2}
            pr={1}
            variant={"ghost"}
            color={"current"}
            size="sm"
            {...props}
          >
            {lang.toUpperCase()}
            <IconChevronDown stroke={1.5} />
          </Btn>
        </MenuTrigger>

        <Portal>
          <MenuPositioner>
            <MenuContent zIndex={2000}>
              {LANGUAGES.map((item, i) => {
                const active = item.key === lang;

                return (
                  <MenuItem
                    key={i}
                    value={item.key}
                    onClick={() => setLang(item.key as any)}
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
                  </MenuItem>
                );
              })}
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    </Tooltip>
  );
};
