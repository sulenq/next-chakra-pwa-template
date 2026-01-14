import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useLang from "@/context/useLang";
import { back } from "@/utils/client";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { IconAccessPointOff } from "@tabler/icons-react";
import { useEffect } from "react";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui/disclosure";
import { DisclosureHeaderContent } from "../ui/disclosure-header-content";
import useOffline from "@/context/disclosure/useOffilne";
import BackButton from "./BackButton";
import { Btn } from "../ui/btn";
import { EmptyState } from "../ui/empty-state";
import { disclosureId } from "@/utils/disclosure";

export const OfflineAlert = () => {
  // Contexts
  const { offline } = useOffline();
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId("offline-alert"), open, onOpen, onClose);

  useEffect(() => {
    if (offline) onOpen();
    if (!offline && open) back();
  }, [offline]);

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"} role={"alertdialog"}>
      <DisclosureContent>
        <DisclosureHeader border={"none"}>
          <DisclosureHeaderContent title={``} />
        </DisclosureHeader>

        <DisclosureBody>
          <EmptyState
            icon={
              <Icon>
                <IconAccessPointOff />
              </Icon>
            }
            title={l.alert_offline.title}
            description={l.alert_offline.description}
            maxW={"300px"}
            m={"auto"}
            mb={12}
          />
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
          <Btn
            colorPalette={themeConfig.colorPalette}
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
