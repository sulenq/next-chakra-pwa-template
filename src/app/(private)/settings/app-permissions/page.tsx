"use client";

import { Btn } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Item } from "@/components/widgets/item";
import { LocalSettingsHelperText } from "@/components/widgets/local-settings-helper-text";
import { MicVolumeBar } from "@/components/widgets/mic-volume-bar";
import { ToggleSettingContainer } from "@/components/widgets/settings-shell";
import { R_SPACING_MD } from "@/constants/styles";
import { useCameraPermission } from "@/contexts/useCameraPermissions";
import { useLocale } from "@/contexts/useLocale";
import { useLocationPermissions } from "@/contexts/useLocationPermissions";
import { useMicPermissions } from "@/contexts/useMicPermissions";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { startCamera, stopCamera } from "@/utils/camera";
import { disclosureId } from "@/utils/disclosure";
import { getAddress, getLatLon } from "@/utils/location";
import { HStack } from "@chakra-ui/react";
import { CameraIcon, MapPinIcon, MicIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CameraSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const { cameraPermissionsStatus } = useCameraPermission();

  // States
  const getBrowserSettingsLink = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
      return t.msg_chrome_permissions_settings_link;
    } else if (userAgent.includes("Firefox")) {
      return t.msg_firefox_permissions_settings_link;
    } else if (userAgent.includes("Edg")) {
      return t.msg_edge_permissions_settings_link;
    }

    return t.msg_default_permissions_settings_link;
  };

  // Utils
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

  // Components
  const Test = () => {
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

    return (
      <>
        <Btn
          size={"xs"}
          variant={"outline"}
          onClick={onOpen}
          disabled={cameraPermissionsStatus !== "granted"}
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
                          title: t.error_camera.title,
                          description: t.error_camera.description,
                        }),
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

  return (
    <Item.Root>
      <Item.Header borderless justify={"space-between"}>
        <HStack>
          <AppIconLucide icon={CameraIcon} />

          <P fontWeight={"semibold"}>{t.camera}</P>
        </HStack>

        <Test />
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <ToggleSettingContainer>
            <StackV gap={1}>
              <P>{t.settings_camera.title}</P>
              <P color={"fg.subtle"}>{t.settings_camera.description}</P>
            </StackV>

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
            <StackV>
              <P color={"fg.subtle"}>
                {cameraPermissionsStatus === "granted"
                  ? t.msg_permissions_granted_helper
                  : t.msg_permissions_denied_helper}
              </P>
              <P color={"fg.subtle"}>
                {`${getBrowserSettingsLink()} ${t.camera}`}
              </P>
            </StackV>
          )}
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

const MicrophoneSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const { micPermissionsStatus } = useMicPermissions();

  // States
  const getBrowserSettingsLink = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
      return t.msg_chrome_permissions_settings_link;
    } else if (userAgent.includes("Firefox")) {
      return t.msg_firefox_permissions_settings_link;
    } else if (userAgent.includes("Edg")) {
      return t.msg_edge_permissions_settings_link;
    }
    return t.msg_default_permissions_settings_link;
  };

  // Utils
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

  // Components
  const Test = () => {
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
        setAnalyser(analyserNode); // Update state analyser

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Gagal mengakses mikrofon:", error);
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

    return (
      <>
        <Btn
          size={"xs"}
          variant={"outline"}
          onClick={onOpen}
          disabled={micPermissionsStatus !== "granted"}
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
                variant={"outline"}
                onClick={stopMicTest}
                disabled={!micOpen}
              >
                {t.close} {t.mic.toLowerCase()}
              </Btn>
              <Btn
                colorPalette={themeConfig.colorPalette}
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

  return (
    <Item.Root>
      <Item.Header borderless justify={"space-between"}>
        <HStack>
          <AppIconLucide icon={MicIcon} />

          <P fontWeight={"semibold"}>{t.mic}</P>
        </HStack>

        <Test />
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <ToggleSettingContainer>
            <StackV gap={1}>
              <P>{t.settings_mic.title}</P>
              <P color={"fg.subtle"}>{t.settings_mic.description}</P>
            </StackV>

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
            <StackV>
              <P color={"fg.subtle"}>
                {micPermissionsStatus === "granted"
                  ? t.msg_permissions_granted_helper
                  : t.msg_permissions_denied_helper}
              </P>
              <P color={"fg.subtle"}>
                {`${getBrowserSettingsLink()} ${t.mic}`}
              </P>
            </StackV>
          )}
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

const LocationSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const { locationPermissionsStatus } = useLocationPermissions();

  // States
  const getBrowserSettingsLink = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
      return t.msg_chrome_permissions_settings_link;
    } else if (userAgent.includes("Firefox")) {
      return t.msg_firefox_permissions_settings_link;
    } else if (userAgent.includes("Edg")) {
      return t.msg_edge_permissions_settings_link;
    }
    return t.msg_default_permissions_settings_link;
  };

  // Utils
  function requestLocationPermission() {
    getLatLon()
      .then((r) => {
        console.debug(r);
      })
      .catch((error: any) => {
        console.error(error);
        switch (error.code) {
          case error.POSITION_UNAVAILABLE:
            toaster.error({
              title: t.errpr_location_support.title,
              description: t.errpr_location_support.description,
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
          title: t.errpr_location_support.title,
          description: t.errpr_location_support.description,
        });
        return;
      });
  }

  // Components
  const Test = () => {
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
      getLatLon().then(({ coords }: any) => {
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
      });
    }

    return (
      <>
        <Btn
          size={"xs"}
          variant={"outline"}
          onClick={onOpen}
          disabled={locationPermissionsStatus !== "granted"}
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
                      {t.address}
                    </P>
                    <P>{address}</P>
                  </HStack>
                </StackV>
              )}
            </Disclosure.Body>

            <Disclosure.Footer>
              <Btn
                colorPalette={themeConfig.colorPalette}
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

  return (
    <Item.Root>
      <Item.Header borderless justify={"space-between"}>
        <HStack>
          <AppIconLucide icon={MapPinIcon} />

          <P fontWeight={"semibold"}>{t.location}</P>
        </HStack>

        <Test />
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <ToggleSettingContainer>
            <StackV gap={1}>
              <P>{t.settings_location.title}</P>
              <P color={"fg.subtle"}>{t.settings_location.description}</P>
            </StackV>

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
            <StackV>
              <P color={"fg.subtle"}>
                {locationPermissionsStatus === "granted"
                  ? t.msg_permissions_granted_helper
                  : t.msg_permissions_denied_helper}
              </P>
              <P color={"fg.subtle"}>
                {`${getBrowserSettingsLink()} ${t.location}`}
              </P>
            </StackV>
          )}
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

export default function Page() {
  return (
    <StackV gap={2}>
      <CameraSection />

      <MicrophoneSection />

      <LocationSection />

      <LocalSettingsHelperText />
    </StackV>
  );
}
