import { getBadgeText } from "@/features/settings/app-permission/utils/getBadgeText";
import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { Item } from "@/components/widgets/item";
import { MicVolumeBar } from "@/components/widgets/mic-volume-bar";
import { SettingItemContainer } from "@/components/widgets/settings-shell";
import { R_SPACING_MD } from "@/constants/styles";
import { useMicPermissions } from "@/features/settings/app-permission/contexts/use-mic-permission-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { Badge } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

const MicTester = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const { micPermissionsStatus, setMicPermissionsStatus } = useMicPermissions();

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
            <Btn variant={"outline"} onClick={stopMicTest} disabled={!micOpen}>
              {t.close} {t.mic.toLowerCase()}
            </Btn>
            <Btn
              colorPalette={themeContext.colorPalette}
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

export const MicrophoneSection = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const { micPermissionsStatus, setMicPermissionsStatus } = useMicPermissions();

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
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText fontWeight={"semibold"}>
        {t.settings_mic_permission_section.title}
      </SettingsHelperText>

      <Item.Body>
        <SettingItemContainer>
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
            colorPalette={themeContext.colorPalette}
          />
        </SettingItemContainer>

        <Divider mx={4} />

        <SettingItemContainer disabled={!isGranted}>
          <StackV gap={1}>
            <P>{t.settings_mic_permission_test.title}</P>
          </StackV>

          <MicTester />
        </SettingItemContainer>
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
