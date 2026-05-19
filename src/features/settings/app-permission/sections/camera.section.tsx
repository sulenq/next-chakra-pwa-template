import { getBadgeText } from "@/features/settings/app-permission/utils/getBadgeText";
import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { Item } from "@/components/container/item";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { R_SPACING_MD } from "@/constants/styles";
import { useCameraPermissionContext } from "@/features/settings/app-permission/contexts/use-camera-permission-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { startCamera, stopCamera } from "@/utils/camera";
import { disclosureId } from "@/utils/disclosure";
import { Badge } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

const CameraTester = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const { cameraPermissionsStatus, setCameraPermissionsStatus } =
    useCameraPermissionContext();

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("camera-test"));

  // States, Refs
  const [cameraOpen, setCameraOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera(videoRef, streamRef, () => setCameraOpen(false));
    };
  }, []);

  const isGranted =
    cameraPermissionsStatus === "granted_permanent" ||
    cameraPermissionsStatus === "granted_temporary";

  return (
    <>
      <Btn
        size={"xs"}
        variant={"outline"}
        onClick={onOpen}
        disabled={!isGranted}
      >
        {t.try_camera}
      </Btn>

      <Disclosure.Root open={open} lazyLoad size={"xs"}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent title={`${t.try_camera}`} />
          </Disclosure.Header>

          <Disclosure.Body p={"0 !important"}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "100%",
                backgroundColor: "black",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: "scaleX(-1)", // Mirror
                  objectFit: "cover",
                }}
              />
            </div>
          </Disclosure.Body>

          <Disclosure.Footer>
            <Btn
              variant={"outline"}
              onClick={() => {
                stopCamera(videoRef, streamRef, () => setCameraOpen(false));
              }}
              disabled={!cameraOpen}
            >
              {t.close} {t.camera.toLowerCase()}
            </Btn>
            <Btn
              colorPalette={themeContext.colorPalette}
              disabled={cameraOpen}
              loading={loading}
              onClick={() => {
                setLoading(true);
                if (!loading) {
                  startCamera(
                    videoRef,
                    streamRef,
                    () => {
                      setLoading(false);
                      setCameraOpen(true);
                      setCameraPermissionsStatus("granted_temporary");
                    },
                    (err) => {
                      setLoading(false);
                      if (
                        err?.name === "NotAllowedError" ||
                        err?.name === "PermissionDeniedError"
                      ) {
                        setCameraPermissionsStatus("denied_temporary");
                      }
                      toaster.error({
                        title: t.error_camera.title,
                        description: t.error_camera.description,
                      });
                    },
                  );
                }
              }}
            >
              {t.open} {t.camera.toLowerCase()}
            </Btn>
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};

// -----------------------------------------------------------------

const CameraPermissionSetting = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const cameraPermissionsStatus = useCameraPermissionContext(
    (s) => s.cameraPermissionsStatus,
  );
  const setCameraPermissionsStatus = useCameraPermissionContext(
    (s) => s.setCameraPermissionsStatus,
  );

  // Utils
  async function requestCameraMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());
      setCameraPermissionsStatus("granted_temporary");
    } catch (error: any) {
      console.error("Akses ditolak:", error);
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setCameraPermissionsStatus("denied_temporary");
      }
    }
  }

  const isGranted =
    cameraPermissionsStatus === "granted_permanent" ||
    cameraPermissionsStatus === "granted_temporary";

  const isDisabled =
    cameraPermissionsStatus === "granted_permanent" ||
    cameraPermissionsStatus === "denied_permanent";

  return (
    <SettingItemContainer
      onClick={() => {
        if (!isDisabled) {
          if (isGranted) {
            // Allow toggling off temporary permissions
            setCameraPermissionsStatus("prompt");
          } else {
            requestCameraMic();
          }
        }
      }}
    >
      <StackV gap={1}>
        <StackH align={"center"} gap={2}>
          <P>{t.settings_camera_permission.title}</P>
          {cameraPermissionsStatus !== "prompt" && (
            <Badge
              colorPalette={
                cameraPermissionsStatus.startsWith("granted")
                  ? cameraPermissionsStatus === "granted_permanent"
                    ? "green"
                    : "yellow"
                  : "red"
              }
              size={"xs"}
              variant={"subtle"}
            >
              {getBadgeText(cameraPermissionsStatus, t)}
            </Badge>
          )}
        </StackH>

        <P color={"fg.subtle"}>{t.settings_camera_permission.description}</P>
      </StackV>

      <Switch
        checked={isGranted}
        disabled={isDisabled}
        onChange={() => {
          if (isGranted) {
            // Allow toggling off temporary permissions
            setCameraPermissionsStatus("prompt");
          } else {
            requestCameraMic();
          }
        }}
        colorPalette={themeContext.colorPalette}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const CameraTesterSetting = () => {
  // Contexts
  const { t } = useLocaleContext();
  const cameraPermissionsStatus = useCameraPermissionContext(
    (s) => s.cameraPermissionsStatus,
  );

  const isGranted =
    cameraPermissionsStatus === "granted_permanent" ||
    cameraPermissionsStatus === "granted_temporary";

  return (
    <SettingItemContainer disabled={!isGranted}>
      <StackV gap={1}>
        <P>{t.settings_camera_permission_test.title}</P>
      </StackV>

      <CameraTester />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

export const CameraSection = () => {
  // Contexts
  const { t } = useLocaleContext();
  const cameraPermissionsStatus = useCameraPermissionContext(
    (s) => s.cameraPermissionsStatus,
  );

  const isGranted =
    cameraPermissionsStatus === "granted_permanent" ||
    cameraPermissionsStatus === "granted_temporary";

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText fontWeight={"semibold"}>
        {t.settings_camera_permission_section.title}
      </SettingsHelperText>

      <Item.Body>
        <CameraPermissionSetting />

        <Divider mx={4} />

        <CameraTesterSetting />
      </Item.Body>

      {cameraPermissionsStatus !== "prompt" && (
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
