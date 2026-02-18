"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { AppIcon } from "@/components/widget/AppIcon";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import { LocalSettingsHelperText } from "@/components/widget/LocalSettingsHelperText";
import { MicVolumeBar } from "@/components/widget/MicVolumeBar";
import { ToggleSettingContainer } from "@/components/widget/SettingsShell";
import useCameraPermission from "@/context/useCameraPermissions";
import useLang from "@/context/useLang";
import useLocationPermissions from "@/context/useLocationPermissions";
import useMicPermissions from "@/context/useMicPermissions";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { startCamera, stopCamera } from "@/utils/camera";
import { disclosureId } from "@/utils/disclosure";
import { getAddress, getLatLon } from "@/utils/location";
import { HStack, useDisclosure } from "@chakra-ui/react";
import { CameraIcon, MapPinIcon, MicIcon } from "lucide-react";
import { useRef, useState } from "react";

const Camera = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { cameraPermissionsStatus } = useCameraPermission();

  // Request permissions func
  async function requestCameraMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Akses ditolak:", error);
    }
  }

  // Status helper text
  const getBrowserSettingsLink = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
      return l.msg_chrome_permissions_settings_link;
    } else if (userAgent.includes("Firefox")) {
      return l.msg_firefox_permissions_settings_link;
    } else if (userAgent.includes("Edg")) {
      return l.msg_edge_permissions_settings_link;
    }
    return l.msg_default_permissions_settings_link;
  };

  // Components
  const Test = () => {
    // Utils
    const { open, onOpen, onClose } = useDisclosure();
    function handleClose() {
      stopCamera(videoRef, streamRef, () => setCameraOpen(false));
      onClose();
    }
    useBackOnClose(disclosureId("camera-test"), open, onOpen, handleClose);

    // States, Refs
    const [cameraOpen, setCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    return (
      <>
        <Btn
          size={"xs"}
          variant={"ghost"}
          onClick={onOpen}
          disabled={cameraPermissionsStatus !== "granted"}
        >
          {l.try_camera}
        </Btn>

        <DisclosureRoot open={open} lazyLoad size={"xs"}>
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent title={`${l.try_camera}`} />
            </DisclosureHeader>

            <DisclosureBody p={"0 !important"}>
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
            </DisclosureBody>

            <DisclosureFooter>
              <Btn
                variant="outline"
                onClick={() => {
                  stopCamera(videoRef, streamRef, () => setCameraOpen(false));
                }}
                disabled={!cameraOpen}
              >
                {l.close} {l.camera.toLowerCase()}
              </Btn>
              <Btn
                colorPalette={themeConfig.colorPalette}
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
                      },
                      () =>
                        toaster.error({
                          title: l.error_camera.title,
                          description: l.error_camera.description,
                        }),
                    );
                  }
                }}
              >
                {l.open} {l.camera.toLowerCase()}
              </Btn>
            </DisclosureFooter>
          </DisclosureContent>
        </DisclosureRoot>
      </>
    );
  };

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={CameraIcon} />

          <P fontWeight={"semibold"}>{l.camera}</P>
        </HStack>

        <Test />
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          px={4}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <ToggleSettingContainer>
            <CContainer>
              <P>{l.settings_camera.title}</P>
              <P color={"fg.subtle"}>{l.settings_camera.description}</P>
            </CContainer>

            <Switch
              checked={cameraPermissionsStatus === "granted"}
              disabled={
                cameraPermissionsStatus === "granted" ||
                cameraPermissionsStatus === "denied"
              }
              onChange={requestCameraMic}
              colorPalette={themeConfig.colorPalette}
            />
          </ToggleSettingContainer>

          {(cameraPermissionsStatus === "granted" ||
            cameraPermissionsStatus === "denied") && (
            <CContainer>
              <P color={"fg.subtle"}>
                {cameraPermissionsStatus === "granted"
                  ? l.msg_permissions_granted_helper
                  : l.msg_permissions_denied_helper}
              </P>
              <P color={"fg.subtle"}>
                {`${getBrowserSettingsLink()}
              ${l.camera}`}
              </P>
            </CContainer>
          )}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

const Microphone = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { micPermissionsStatus } = useMicPermissions();

  // Request permissions func
  async function requestMicPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Akses mikrofon ditolak:", error);
    }
  }

  // Status helper text
  const getBrowserSettingsLink = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
      return l.msg_chrome_permissions_settings_link;
    } else if (userAgent.includes("Firefox")) {
      return l.msg_firefox_permissions_settings_link;
    } else if (userAgent.includes("Edg")) {
      return l.msg_edge_permissions_settings_link;
    }
    return l.msg_default_permissions_settings_link;
  };

  // Components
  const Test = () => {
    // States, Refs
    const [micOpen, setMicOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Utils
    const { open, onOpen, onClose } = useDisclosure();
    function handleClose() {
      stopMicTest();
      onClose();
    }
    useBackOnClose(disclosureId("mic-test"), open, onOpen, handleClose);

    // Handle test mic
    const startMicTest = async () => {
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
        setAnalyser(analyserNode); // Update state analyser

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Gagal mengakses mikrofon:", error);
      }
    };

    const stopMicTest = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      setMicOpen(false);
      setAnalyser(null);
    };

    return (
      <>
        <Btn
          size="xs"
          variant="ghost"
          onClick={onOpen}
          disabled={micPermissionsStatus !== "granted"}
        >
          {l.try_mic}
        </Btn>

        <DisclosureRoot open={open} lazyLoad size="xs">
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent title={l.try_mic} />
            </DisclosureHeader>

            <DisclosureBody>
              <CContainer py={4}>
                <P mb={2}>Volume</P>

                {/* Ini progress bar real-time */}
                <MicVolumeBar analyser={analyser} />
              </CContainer>
            </DisclosureBody>

            <DisclosureFooter>
              <Btn variant="outline" onClick={stopMicTest} disabled={!micOpen}>
                {l.close} {l.mic.toLowerCase()}
              </Btn>
              <Btn
                colorPalette={themeConfig.colorPalette}
                disabled={micOpen}
                loading={loading}
                onClick={startMicTest}
              >
                {l.open} {l.mic.toLowerCase()}
              </Btn>
            </DisclosureFooter>
          </DisclosureContent>
        </DisclosureRoot>
      </>
    );
  };

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={MicIcon} />

          <P fontWeight={"semibold"}>{l.mic}</P>
        </HStack>

        <Test />
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          px={4}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <ToggleSettingContainer>
            <CContainer>
              <P>{l.settings_mic.title}</P>
              <P color={"fg.subtle"}>{l.settings_mic.description}</P>
            </CContainer>

            <Switch
              checked={micPermissionsStatus === "granted"}
              disabled={
                micPermissionsStatus === "granted" ||
                micPermissionsStatus === "denied"
              }
              onChange={requestMicPermission}
              colorPalette={themeConfig.colorPalette}
            />
          </ToggleSettingContainer>

          {(micPermissionsStatus === "granted" ||
            micPermissionsStatus === "denied") && (
            <CContainer>
              <P color={"fg.subtle"}>
                {micPermissionsStatus === "granted"
                  ? l.msg_permissions_granted_helper
                  : l.msg_permissions_denied_helper}
              </P>
              <P color={"fg.subtle"}>
                {`${getBrowserSettingsLink()}
              ${l.mic}`}
              </P>
            </CContainer>
          )}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

const Location = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { locationPermissionsStatus } = useLocationPermissions();

  // Request permissions func
  const requestLocationPermission = () => {
    getLatLon()
      .then((r) => {
        console.debug(r);
      })
      .catch((error: any) => {
        console.error(error);
        switch (error.code) {
          case error.POSITION_UNAVAILABLE:
            toaster.error({
              title: l.errpr_location_support.title,
              description: l.errpr_location_support.description,
            });
            break;
          default:
            toaster.error({
              title: l.error_location.title,
              description: l.error_location.description,
            });
            break;
        }
        toaster.error({
          title: l.errpr_location_support.title,
          description: l.errpr_location_support.description,
        });
        return;
      });
  };

  // Status helper text
  const getBrowserSettingsLink = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
      return l.msg_chrome_permissions_settings_link;
    } else if (userAgent.includes("Firefox")) {
      return l.msg_firefox_permissions_settings_link;
    } else if (userAgent.includes("Edg")) {
      return l.msg_edge_permissions_settings_link;
    }
    return l.msg_default_permissions_settings_link;
  };

  // Components
  const Test = () => {
    // States, Refs
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState<{ lat: number; long: number } | null>(
      null,
    );
    const [address, setAddress] = useState<string | null>(null);

    // Utils
    const { open, onOpen, onClose } = useDisclosure();
    useBackOnClose(disclosureId("location-test"), open, onOpen, onClose);

    // Handle test
    function startLocationTest() {
      setLoading(true);
      getLatLon().then(({ coords }: any) => {
        setCenter({ lat: coords.latitude, long: coords.longitude });
        getAddress(coords.latitude, coords.longitude)
          .then((data) => {
            setAddress(data.display_name || l.address_not_found);
          })
          .catch((error) => {
            console.error("Gagal mendapatkan alamat:", error);
            toaster.error({
              title: l.error_location.title,
              description: l.error_location.description,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }

    return (
      <>
        <Btn
          size="xs"
          variant="ghost"
          onClick={onOpen}
          disabled={locationPermissionsStatus !== "granted"}
        >
          {l.try_location}
        </Btn>

        <DisclosureRoot open={open} lazyLoad size="xs">
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent title={l.try_location} />
            </DisclosureHeader>

            <DisclosureBody>
              {!address && <P>{l.msg_location_test_helper}</P>}

              {address && center && (
                <CContainer gap={2}>
                  <HStack align={"start"}>
                    <P w={"100px"} color={"fg.muted"} flexShrink={0}>
                      Latitude
                    </P>
                    <P>{`${center.lat}`}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"100px"} color={"fg.muted"} flexShrink={0}>
                      Longitude
                    </P>
                    <P>{`${center.long}`}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"100px"} color={"fg.muted"} flexShrink={0}>
                      {l.address}
                    </P>
                    <P>{address}</P>
                  </HStack>
                </CContainer>
              )}
            </DisclosureBody>

            <DisclosureFooter>
              <Btn
                colorPalette={themeConfig.colorPalette}
                loading={loading}
                onClick={startLocationTest}
              >
                {l.get} {l.location.toLowerCase()}
              </Btn>
            </DisclosureFooter>
          </DisclosureContent>
        </DisclosureRoot>
      </>
    );
  };

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={MapPinIcon} />

          <P fontWeight={"semibold"}>{l.location}</P>
        </HStack>

        <Test />
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          px={4}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <ToggleSettingContainer>
            <CContainer>
              <P>{l.settings_location.title}</P>
              <P color={"fg.subtle"}>{l.settings_location.description}</P>
            </CContainer>

            <Switch
              checked={locationPermissionsStatus === "granted"}
              disabled={
                locationPermissionsStatus === "granted" ||
                locationPermissionsStatus === "denied"
              }
              onChange={requestLocationPermission}
              colorPalette={themeConfig.colorPalette}
            />
          </ToggleSettingContainer>

          {(locationPermissionsStatus === "granted" ||
            locationPermissionsStatus === "denied") && (
            <CContainer>
              <P color={"fg.subtle"}>
                {locationPermissionsStatus === "granted"
                  ? l.msg_permissions_granted_helper
                  : l.msg_permissions_denied_helper}
              </P>
              <P color={"fg.subtle"}>
                {`${getBrowserSettingsLink()} ${l.location}`}
              </P>
            </CContainer>
          )}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default function Page() {
  return (
    <CContainer flex={1} gap={3}>
      <Camera />

      <Microphone />

      <Location />

      <LocalSettingsHelperText />
    </CContainer>
  );
}
