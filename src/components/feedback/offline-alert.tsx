import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";
import { toaster } from "@/components/ui/toaster";
import { BackButton } from "@/components/navigation/back-button";
import { useAlerts } from "@/contexts/use-alert-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { Icon } from "@chakra-ui/react";
import { IconAccessPointOff } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

// -----------------------------------------------------------------

export const OfflineAlert = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const isOffline = useAlerts((s) => s.alerts["offline"] ?? false);
  const showAlert = useAlerts((s) => s.showAlert);
  const hideAlert = useAlerts((s) => s.hideAlert);

  // Refs
  const hasOpenedRef = useRef(false);

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("offline-alert"));

  // Handler
  useEffect(() => {
    function handleOnline() {
      hideAlert("offline");

      toaster.success({
        id: "success-online",
        title: t.success_online.title,
        description: t.success_online.description,
      });
    }

    function handleOffline() {
      showAlert("offline");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // if (!navigator.onLine) handleOffline();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showAlert, hideAlert, t]);

  // State handler
  useEffect(() => {
    if (isOffline) {
      if (!hasOpenedRef.current) {
        onOpen();
        hasOpenedRef.current = true;
      }
    } else {
      hasOpenedRef.current = false;
      if (open) {
        back();
      }
    }
  }, [isOffline, open, onOpen]);

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
            colorPalette={themeContext.colorPalette}
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
