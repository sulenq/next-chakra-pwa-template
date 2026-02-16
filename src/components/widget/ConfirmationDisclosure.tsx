import { Btn, BtnProps } from "@/components/ui/btn";
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
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { StackProps, useDisclosure } from "@chakra-ui/react";
import BackButton from "./BackButton";
import { disclosureId } from "@/utils/disclosure";

interface Props__Disclosure {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirmButtonProps?: BtnProps;
  loading?: boolean;
  addonElement?: any;
}
export const ConfirmationDisclosure = (props: Props__Disclosure) => {
  // Props
  const {
    open,
    title,
    description,
    confirmLabel,
    onConfirm,
    confirmButtonProps,
    loading = false,
    addonElement,
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <DisclosureRoot open={open} size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`${title}`} />
        </DisclosureHeader>

        <DisclosureBody>
          <P>{description}</P>

          {addonElement}
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton disabled={loading} />

          <Btn
            onClick={onConfirm}
            loading={loading}
            colorPalette={themeConfig.colorPalette}
            {...confirmButtonProps}
          >
            {confirmLabel}
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

interface Props__Trigger extends StackProps {
  children?: any;
  id: string;
  title: string;
  description: string;
  confirmLabel: any;
  onConfirm: () => void;
  confirmButtonProps?: BtnProps;
  loading?: boolean;
  disabled?: any;
  addonElement?: any;
  onClick?: () => void;
}
export const ConfirmationDisclosureTrigger = (props: Props__Trigger) => {
  // Props
  const {
    children,
    id,
    title,
    description,
    confirmLabel,
    onConfirm,
    confirmButtonProps,
    loading,
    disabled,
    addonElement,
    onClick,
    ...restProps
  } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`${id}`), open, onOpen, onClose);

  return (
    <>
      <CContainer
        w={"fit"}
        onClick={
          onClick
            ? () => {
                onClick();
                onOpen();
              }
            : disabled
            ? () => {}
            : onOpen
        }
        {...restProps}
      >
        {children}
      </CContainer>

      <ConfirmationDisclosure
        open={open}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        onConfirm={onConfirm}
        confirmButtonProps={confirmButtonProps}
        loading={loading}
        addonElement={addonElement}
      />
    </>
  );
};
