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
import { useLocationPermissionContext } from "@/features/settings/app-permission/contexts/use-location-permission-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { getAddress, getLatLon } from "@/utils/location";
import { Badge } from "@chakra-ui/react";
import { useState } from "react";

// -----------------------------------------------------------------

const LocationTester = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const { locationPermissionsStatus, setLocationPermissionsStatus } =
    useLocationPermissionContext();

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

const LocationPermissionSetting = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const locationPermissionsStatus = useLocationPermissionContext(
    (s) => s.locationPermissionsStatus,
  );
  const setLocationPermissionsStatus = useLocationPermissionContext(
    (s) => s.setLocationPermissionsStatus,
  );

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
    <SettingItemContainer
      onClick={() => {
        if (!isDisabled) {
          if (isGranted) {
            // Allow toggling off temporary permissions
            setLocationPermissionsStatus("prompt");
          } else {
            requestLocationPermission();
          }
        }
      }}
    >
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

        <P color={"fg.subtle"}>{t.settings_location_permission.description}</P>
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
  );
};

// -----------------------------------------------------------------

const LocationTesterSetting = () => {
  // Contexts
  const { t } = useLocaleContext();
  const locationPermissionsStatus = useLocationPermissionContext(
    (s) => s.locationPermissionsStatus,
  );

  const isGranted =
    locationPermissionsStatus === "granted_permanent" ||
    locationPermissionsStatus === "granted_temporary";

  return (
    <SettingItemContainer disabled={!isGranted}>
      <StackV gap={1}>
        <P>{t.settings_location_permission_test.title}</P>
      </StackV>

      <LocationTester />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

export const LocationSection = () => {
  // Contexts
  const { t } = useLocaleContext();
  const locationPermissionsStatus = useLocationPermissionContext(
    (s) => s.locationPermissionsStatus,
  );

  const isGranted =
    locationPermissionsStatus === "granted_permanent" ||
    locationPermissionsStatus === "granted_temporary";

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText fontWeight={"semibold"}>
        {t.settings_location_permission_section.title}
      </SettingsHelperText>

      <Item.Body>
        <LocationPermissionSetting />

        <Divider mx={4} />

        <LocationTesterSetting />
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
