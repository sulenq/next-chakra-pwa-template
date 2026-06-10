import { MainView } from "@/components/container/main-view";
import { WithVQueryNavsLayout } from "@/components/layout/with-v-query-navs-layout";
import { Disclosure } from "@/components/ui/disclosure";
import { StackH, StackV } from "@/components/ui/stack";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { SPACING_MD, TOP_BAR_H } from "@/constants/styles";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";

export interface SettingsDisclosureProps {
  open: boolean;
}

const SettingsDisclosure = (props: SettingsDisclosureProps) => {
  // Props
  const { open, ...restProps } = props;

  // Derived Values
  const NAVS =
    OTHER_PRIVATE_NAV_GROUPS[0].navs.find((n) => n.path === "/settings")
      ?.children || [];

  return (
    <Disclosure.Root open={open} lazyLoad size={"xl"} {...restProps}>
      <Disclosure.Content overflow={"clip"}>
        <Disclosure.Body p={0}>
          <MainView.Root minH={"600px"}>
            <WithVQueryNavsLayout navs={NAVS}>
              <StackV flex={1} bg={"bg.canvas"}>
                <StackH align={"center"} gap={2} h={TOP_BAR_H} p={SPACING_MD}>
                  <MainView.Title textAlign={"center"} mx={"auto"} />

                  <Disclosure.CloseButton />
                </StackH>
              </StackV>
            </WithVQueryNavsLayout>
          </MainView.Root>
        </Disclosure.Body>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};

// -----------------------------------------------------------------

export interface SettingsTriggerProps extends StackProps {}

const SettingsTrigger = (props: SettingsTriggerProps) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("settings"));

  return (
    <>
      <StackV onClick={onOpen} {...restProps}>
        {children}
      </StackV>

      <SettingsDisclosure open={open} />
    </>
  );
};

export const Settings = {
  Disclosure: SettingsDisclosure,
  Trigger: SettingsTrigger,
};
