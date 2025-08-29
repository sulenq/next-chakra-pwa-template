import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { Text } from "@chakra-ui/react";
import CContainer from "../ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import useConfirmationDisclosure from "@/context/disclosure/useConfirmationDisclosure";
import BackButton from "./BackButton";
import Btn from "../ui-custom/Btn";

interface Props {
  children?: any;
}

const ConfirmationDisclosure = (props: Props) => {
  // Props
  const { children } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const {
    confirmationData,
    confirmationOpen,
    confirmationOnOpen,
    confirmationOnClose,
  } = useConfirmationDisclosure();

  // Utils
  useBackOnClose(
    `confirm-${confirmationData?.title}-${confirmationData?.id}`,
    confirmationOpen,
    confirmationOnOpen,
    confirmationOnClose
  );

  return (
    <>
      <CContainer
        w={"unset"}
        onClick={confirmationData?.disabled ? undefined : confirmationOnOpen}
        {...confirmationData?.triggerProps}
      >
        {children}
      </CContainer>

      <DisclosureRoot open={confirmationOpen} size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${confirmationData?.title}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <Text>{confirmationData?.description}</Text>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton disabled={confirmationData?.loading} />
            <Btn
              onClick={confirmationData?.onConfirm}
              loading={confirmationData?.loading}
              colorPalette={themeConfig.colorPalette}
              {...confirmationData?.confirmButtonProps}
            >
              {confirmationData?.confirmLabel}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default ConfirmationDisclosure;
