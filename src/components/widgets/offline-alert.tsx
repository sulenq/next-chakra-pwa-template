import useOffline from "@/contexts/disclosure/useOffilne";
import useLocale from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { back } from "@/utils/client";
import { Icon } from "@chakra-ui/react";
import { IconAccessPointOff } from "@tabler/icons-react";
import { useEffect } from "react";
import { Disclosure } from "@/components/ui/disclosure";
import { BackButton } from "@/components/widgets/back-button";

import usePopDisclosure from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { Btn } from "@/components/ui/btn";
import { EmptyState } from "@/components/ui/empty-state";

export const OfflineAlert = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const { offline } = useOffline();

  // Utils
  const { open, onOpen } = usePopDisclosure(disclosureId("offline-alert"));

  useEffect(() => {
    if (offline) onOpen();
    if (!offline && open) back();
  }, [offline]);

  return (
    <Disclosure.Root open={open} lazyLoad size={"xs"} role={"alertdialog"}>
      <Disclosure.Content>
        <Disclosure.Header border={"none"}>
          <Disclosure.HeaderContent title={``} />
        </Disclosure.Header>

        <Disclosure.Body>
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
        </Disclosure.Body>

        <Disclosure.Footer>
          <BackButton />
          <Btn
            colorPalette={themeConfig.colorPalette}
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </Btn>
        </Disclosure.Footer>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};
