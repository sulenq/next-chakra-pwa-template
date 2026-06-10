import { BackButton } from "@/components/navigation/back-button";
import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";
import { toaster } from "@/components/ui/toaster";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { Icon } from "@chakra-ui/react";
import { IconAccessPointOff } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

export const OfflineAlert = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { open, onOpen, onClose } = usePopDisclosure(
    disclosureId("offline-alert"),
  );

  // Ref untuk mengunci agar trigger offline hanya dieksekusi tepat 1 kali
  const hasTriggered = useRef(false);
  // Simpan referensi teks translasi ke dalam ref agar event listener selalu mendapatkan data terbaru tanpa memicu ulang useEffect
  const translationRef = useRef(t);

  useEffect(() => {
    translationRef.current = t;
  }, [t]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Cek kondisi awal saat pertama kali masuk ke client-side
    if (!navigator.onLine && !hasTriggered.current) {
      hasTriggered.current = true;
      onOpen();
    }

    // 2. Handler Online
    function handleOnline() {
      hasTriggered.current = false; // Reset kunci saat internet kembali
      onClose();
      toaster.success({
        id: "success-online",
        title: translationRef.current.success_online.title,
        description: translationRef.current.success_online.description,
      });
    }

    // 3. Handler Offline
    function handleOffline() {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        onOpen();
      }
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onOpen, onClose]); // Array dependensi bersih dari objek dinamis

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
