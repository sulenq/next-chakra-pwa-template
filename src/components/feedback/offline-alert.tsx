import { BackButton } from "@/components/navigation/back-button";
import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";
import { toaster } from "@/components/ui/toaster";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { Icon } from "@chakra-ui/react";
import { IconAccessPointOff } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const OfflineAlert = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { open, onOpen, onClose } = usePopDisclosure(
    disclosureId("offline-alert"),
  );

  // States
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    function handleOnline() {
      setIsOffline(false);
      toaster.success({
        id: "success-online",
        title: t.success_online.title,
        description: t.success_online.description,
      });
    }

    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [t]);

  useEffect(() => {
    if (isOffline) {
      const timer = setTimeout(() => onOpen(), 50);
      return () => clearTimeout(timer);
    } else {
      onClose();
    }
  }, [isOffline, onOpen, onClose]);

  return (
    <Disclosure.Root
      open={isOffline || open}
      lazyLoad
      size={"xs"}
      role={"alertdialog"}
    >
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
            colorPalette={theme.colorPalette}
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
