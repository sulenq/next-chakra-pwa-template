import { GroupItem } from "@/components/container/group-item";
import { Item } from "@/components/container/item";
import { MicVolumeBar } from "@/components/misc/mic-volume-bar";
import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import {
  SettingsGroupTitle,
  SettingsHelperText,
} from "@/components/ui/typography";
import { R_SPACING_MD } from "@/constants/styles";
import { useMicPermissionStore } from "@/features/settings/app-permission/stores/use-mic-permission-store";
import { getBadgeText } from "@/features/settings/app-permission/utils/getBadgeText";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { Badge } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

const MicTester = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();
  const { micPermissionsStatus, setMicPermissionsStatus } =
    useMicPermissionStore();

  // Refs
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("mic-test"));

  // States
  const [micOpen, setMicOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Utils
  async function startMicTest() {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;
      setMicOpen(true);

      // Setup audio context
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyserNode = audioContextRef.current.createAnalyser();
      analyserNode.fftSize = 512;
      source.connect(analyserNode);
      setAnalyser(analyserNode);

      setLoading(false);
      setMicPermissionsStatus("granted_temporary");
    } catch (error: any) {
      setLoading(false);
      console.error("Gagal mengakses mikrofon:", error);
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setMicPermissionsStatus("denied_temporary");
      }
    }
  }

  function stopMicTest() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setMicOpen(false);
    setAnalyser(null);
  }

  // Cleanup
  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, []);

  const isGranted =
    micPermissionsStatus === "granted_permanent" ||
    micPermissionsStatus === "granted_temporary";

  return (
    <>
      <Btn
        size={"xs"}
        variant={"outline"}
        onClick={onOpen}
        disabled={!isGranted}
      >
        {t.try_mic}
      </Btn>

      <Disclosure.Root open={open} lazyLoad size={"xs"}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent title={t.try_mic} />
          </Disclosure.Header>

          <Disclosure.Body>
            <StackV py={4}>
              <P mb={2}>Volume</P>

              {/* Ini progress bar real-time */}
              <MicVolumeBar analyser={analyser} />
            </StackV>
          </Disclosure.Body>

          <Disclosure.Footer>
            <Btn
              flex={1}
              variant={"outline"}
              onClick={stopMicTest}
              disabled={!micOpen}
            >
              {t.close} {t.mic.toLowerCase()}
            </Btn>

            <Btn
              flex={1}
              colorPalette={theme.colorPalette}
              disabled={micOpen}
              loading={loading}
              onClick={startMicTest}
            >
              {t.open} {t.mic.toLowerCase()}
            </Btn>
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};

// -----------------------------------------------------------------

const MicAccessSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();
  const micPermissionsStatus = useMicPermissionStore(
    (s) => s.micPermissionsStatus,
  );
  const setMicPermissionsStatus = useMicPermissionStore(
    (s) => s.setMicPermissionsStatus,
  );

  // Utils
  async function requestMicPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());
      setMicPermissionsStatus("granted_temporary");
    } catch (error: any) {
      console.error("Akses mikrofon ditolak:", error);
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setMicPermissionsStatus("denied_temporary");
      }
    }
  }

  const isGranted =
    micPermissionsStatus === "granted_permanent" ||
    micPermissionsStatus === "granted_temporary";

  const isDisabled =
    micPermissionsStatus === "granted_permanent" ||
    micPermissionsStatus === "denied_permanent";

  return (
    <GroupItem.Root>
      <StackV gap={1}>
        <StackH align={"center"} gap={2}>
          <P>{t.settings_mic_permission.title}</P>
          {micPermissionsStatus !== "prompt" && (
            <Badge
              colorPalette={
                micPermissionsStatus.startsWith("granted")
                  ? micPermissionsStatus === "granted_permanent"
                    ? "green"
                    : "yellow"
                  : "red"
              }
              size={"xs"}
              variant={"subtle"}
            >
              {getBadgeText(micPermissionsStatus, t)}
            </Badge>
          )}
        </StackH>

        <P color={"fg.subtle"}>{t.settings_mic_permission.description}</P>
      </StackV>

      <GroupItem.Target>
        <Switch
          checked={isGranted}
          disabled={isDisabled}
          onChange={() => {
            if (isGranted) {
              // Allow toggling off temporary permissions
              setMicPermissionsStatus("prompt");
            } else {
              requestMicPermission();
            }
          }}
          colorPalette={theme.colorPalette}
        />
      </GroupItem.Target>
    </GroupItem.Root>
  );
};

// -----------------------------------------------------------------

const MicTesterSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const micPermissionsStatus = useMicPermissionStore(
    (s) => s.micPermissionsStatus,
  );

  const isGranted =
    micPermissionsStatus === "granted_permanent" ||
    micPermissionsStatus === "granted_temporary";

  return (
    <GroupItem.Root disabled={!isGranted} clickable={false}>
      <StackV gap={1}>
        <P>{t.settings_mic_permission_test.title}</P>
      </StackV>

      <MicTester />
    </GroupItem.Root>
  );
};

// -----------------------------------------------------------------

export const MicrophoneSection = () => {
  // Stores
  const { t } = useLocaleStore();
  const micPermissionsStatus = useMicPermissionStore(
    (s) => s.micPermissionsStatus,
  );

  const isGranted =
    micPermissionsStatus === "granted_permanent" ||
    micPermissionsStatus === "granted_temporary";

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsGroupTitle fontWeight={"semibold"}>
        {t.settings_mic_permission_section.title}
      </SettingsGroupTitle>

      <Item.Body>
        <MicAccessSetting />

        <Divider />

        <MicTesterSetting />
      </Item.Body>

      {micPermissionsStatus !== "prompt" && (
        <StackV>
          <SettingsHelperText color={"fg.subtle"}>
            {isGranted
              ? t.msg_permissions_granted_helper
              : t.msg_permissions_denied_helper}
          </SettingsHelperText>
        </StackV>
      )}
    </Item.Root>
  );
};
