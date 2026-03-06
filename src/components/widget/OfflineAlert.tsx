import useOffline from "@/context/disclosure/useOffilne";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { back } from "@/utils/client";
import { Icon } from "@chakra-ui/react";
import { IconAccessPointOff } from "@tabler/icons-react";
import { useEffect } from "react";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { BackButton } from "@/components/widget/BackButton";

import usePopDisclosure from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { Btn } from "@/components/ui/btn";
import { EmptyState } from "@/components/ui/empty-state";

export const OfflineAlert = () => {
  // Contexts
  const { offline } = useOffline();
  const { themeConfig } = useThemeConfig();
  const { t } = useLang();

  // Utils
  const { open, onOpen } = usePopDisclosure(disclosureId("offline-alert"));

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
            title={t.alert_offline.title}
            description={t.alert_offline.description}
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
