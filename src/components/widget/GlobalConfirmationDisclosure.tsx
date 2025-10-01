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
import useConfirmationDisclosure from "@/context/disclosure/useConfirmationDisclosure";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import BackButton from "./BackButton";

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
            <P>{confirmationData?.description}</P>
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
