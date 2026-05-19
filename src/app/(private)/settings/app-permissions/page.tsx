"use client";

import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import {
  SettingsHelperText,
  SettingsSavedLocalyHelperText,
} from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { Item } from "@/components/widgets/item";
import { MicVolumeBar } from "@/components/widgets/mic-volume-bar";
import { SettingItemContainer } from "@/components/widgets/settings-shell";
import { R_SPACING_MD } from "@/constants/styles";
import { useCameraPermission } from "@/contexts/use-camera-permission-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useLocationPermissions } from "@/contexts/use-location-permission-context";
import { useMicPermissions } from "@/contexts/use-mic-permission-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { startCamera, stopCamera } from "@/utils/camera";
import { disclosureId } from "@/utils/disclosure";
import { getAddress, getLatLon } from "@/utils/location";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@chakra-ui/react";

// -----------------------------------------------------------------

const getBadgeText = (status: string, t: any) => {
  if (status === "granted_permanent") return t.perm_granted_permanent;
  if (status === "granted_temporary") return t.perm_granted_temporary;
  if (status === "denied_permanent") return t.perm_denied_permanent;
  if (status === "denied_temporary") return t.perm_denied_temporary;
  return "";
};

// -----------------------------------------------------------------

const CameraTester = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();
  const { cameraPermissionsStatus, setCameraPermissionsStatus } =
    useCameraPermission();

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

const CameraSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();
  const { cameraPermissionsStatus, setCameraPermissionsStatus } =
    useCameraPermission();

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
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText fontWeight={"semibold"}>
        {t.settings_camera_permission_section.title}
      </SettingsHelperText>

      <Item.Body>
        <SettingItemContainer>
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

            <P color={"fg.subtle"}>
              {t.settings_camera_permission.description}
            </P>
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

        <Divider mx={4} />

        <SettingItemContainer disabled={!isGranted}>
          <StackV gap={1}>
            <P>{t.settings_camera_permission_test.title}</P>
          </StackV>

          <CameraTester />
        </SettingItemContainer>
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

// -----------------------------------------------------------------

const MicTester = () => {
  // Contexts
  const { t } = useLocale();
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

const MicrophoneSection = () => {
  // Contexts
  const { t } = useLocale();
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

// -----------------------------------------------------------------

const LocationTester = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();
  const { locationPermissionsStatus, setLocationPermissionsStatus } =
    useLocationPermissions();

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("location-test"));

  // States
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState<{ lat: number; long: number } | null>(
    null,
  );
  const [address, setAddress] = useState<string | null>(null);

  // Utils
  function startLocationTest() {
    setLoading(true);
    getLatLon()
      .then(({ coords }: any) => {
        setLocationPermissionsStatus("granted_temporary");
        setCenter({ lat: coords.latitude, long: coords.longitude });
        getAddress(coords.latitude, coords.longitude)
          .then((data) => {
            setAddress(data.display_name || t.address_not_found);
          })
          .catch((error) => {
            console.error("Gagal mendapatkan alamat:", error);
            toaster.error({
              title: t.error_location.title,
              description: t.error_location.description,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPermissionsStatus("denied_temporary");
        }
      });
  }

  const isGranted =
    locationPermissionsStatus === "granted_permanent" ||
    locationPermissionsStatus === "granted_temporary";

  return (
    <>
      <Btn
        size={"xs"}
        variant={"outline"}
        onClick={onOpen}
        disabled={!isGranted}
      >
        {t.try_location}
      </Btn>

      <Disclosure.Root open={open} lazyLoad size={"xs"}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent title={t.try_location} />
          </Disclosure.Header>

          <Disclosure.Body>
            {!address && <P>{t.msg_location_test_helper}</P>}

            {address && center && (
              <StackV gap={2}>
                <StackH align={"start"}>
                  <P w={"100px"} color={"fg.muted"} flexShrink={0}>
                    Latitude
                  </P>
                  <P>{`${center.lat}`}</P>
                </StackH>

                <StackH align={"start"}>
                  <P w={"100px"} color={"fg.muted"} flexShrink={0}>
                    Longitude
                  </P>
                  <P>{`${center.long}`}</P>
                </StackH>

                <StackH align={"start"}>
                  <P w={"100px"} color={"fg.muted"} flexShrink={0}>
                    {t.address}
                  </P>
                  <P>{address}</P>
                </StackH>
              </StackV>
            )}
          </Disclosure.Body>

          <Disclosure.Footer>
            <Btn
              colorPalette={themeContext.colorPalette}
              loading={loading}
              onClick={startLocationTest}
            >
              {t.get} {t.location.toLowerCase()}
            </Btn>
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};

// -----------------------------------------------------------------

const LocationSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();
  const { locationPermissionsStatus, setLocationPermissionsStatus } =
    useLocationPermissions();

  // Utils
  function requestLocationPermission() {
    getLatLon()
      .then(() => {
        setLocationPermissionsStatus("granted_temporary");
      })
      .catch((error: any) => {
        console.error(error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPermissionsStatus("denied_temporary");
        }
        switch (error.code) {
          case error.POSITION_UNAVAILABLE:
            toaster.error({
              title: t.error_location_support.title,
              description: t.error_location_support.description,
            });
            break;
          default:
            toaster.error({
              title: t.error_location.title,
              description: t.error_location.description,
            });
            break;
        }
        toaster.error({
          title: t.error_location_support.title,
          description: t.error_location_support.description,
        });
        return;
      });
  }

  const isGranted =
    locationPermissionsStatus === "granted_permanent" ||
    locationPermissionsStatus === "granted_temporary";

  const isDisabled =
    locationPermissionsStatus === "granted_permanent" ||
    locationPermissionsStatus === "denied_permanent";

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText fontWeight={"semibold"}>
        {t.settings_location_permission_section.title}
      </SettingsHelperText>

      <Item.Body>
        <SettingItemContainer>
          <StackV gap={1}>
            <StackH align={"center"} gap={2}>
              <P>{t.settings_location_permission.title}</P>
              {locationPermissionsStatus !== "prompt" && (
                <Badge
                  colorPalette={
                    locationPermissionsStatus.startsWith("granted")
                      ? locationPermissionsStatus === "granted_permanent"
                        ? "green"
                        : "yellow"
                      : "red"
                  }
                  size={"xs"}
                  variant={"subtle"}
                >
                  {getBadgeText(locationPermissionsStatus, t)}
                </Badge>
              )}
            </StackH>

            <P color={"fg.subtle"}>
              {t.settings_location_permission.description}
            </P>
          </StackV>

          <Switch
            checked={isGranted}
            disabled={isDisabled}
            onChange={() => {
              if (isGranted) {
                // Allow toggling off temporary permissions
                setLocationPermissionsStatus("prompt");
              } else {
                requestLocationPermission();
              }
            }}
            colorPalette={themeContext.colorPalette}
          />
        </SettingItemContainer>

        <Divider mx={4} />

        <SettingItemContainer disabled={!isGranted}>
          <StackV gap={1}>
            <P>{t.settings_location_permission_test.title}</P>
          </StackV>

          <LocationTester />
        </SettingItemContainer>
      </Item.Body>

      {locationPermissionsStatus !== "prompt" && (
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

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={2}>
      <CameraSection />

      <MicrophoneSection />

      <LocationSection />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
