import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useLang from "@/context/useLang";
import back from "@/utils/back";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { IconAccessPointOff } from "@tabler/icons-react";
import { useEffect } from "react";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import useOffline from "@/context/disclosure/useOffilne";
import BackButton from "./BackButton";
import Btn from "../ui-custom/Btn";
import { EmptyState } from "../ui/empty-state";

const OfflineDisclosure = () => {
  // Contexts
  const { offline } = useOffline();
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(``, open, onOpen, onClose);

  useEffect(() => {
    if (offline) onOpen();
    if (!offline && open) back();
  }, [offline]);

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader border={"none"}>
          <DisclosureHeaderContent title={``} />
        </DisclosureHeader>

        <DisclosureBody>
          <EmptyState
            icon={
              <Icon>
                <IconAccessPointOff />
              </Icon>
            }
            title={l.alert_offline.title}
            description={l.alert_offline.description}
            maxW={"300px"}
            m={"auto"}
          />
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton>Close</BackButton>
          <Btn
            colorPalette={themeConfig.colorPalette}
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

export default OfflineDisclosure;
