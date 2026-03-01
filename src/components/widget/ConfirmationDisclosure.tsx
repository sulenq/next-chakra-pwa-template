import { Btn, Props__Btn } from "@/components/ui/btn";
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
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";
import BackButton from "./BackButton";

interface Props__Disclosure {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirmButtonProps?: Props__Btn;
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
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
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
  confirmButtonProps?: Props__Btn;
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
  const { open, onOpen } = usePopDisclosure(disclosureId(`${id}`));

  return (
    <>
      <CContainer
        w={"fit"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (disabled) return;

          onClick?.();
          onOpen();
        }}
        cursor={disabled ? "disabled" : "pointer"}
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
