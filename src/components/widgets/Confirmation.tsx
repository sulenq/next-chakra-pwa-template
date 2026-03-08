import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Disclosure } from "@/components/ui/disclosure";
import { P } from "@/components/ui/p";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";
import { BackButton } from "@/components/widgets/BackButton";

interface ConfirmationProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirmButtonProps?: BtnProps;
  loading?: boolean;
  addonElement?: any;
}
const ConfirmationContent = (props: ConfirmationProps) => {
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
    <Disclosure.Root open={open} lazyLoad size={"xs"}>
      <Disclosure.Content>
        <Disclosure.Header>
          <Disclosure.HeaderContent title={`${title}`} />
        </Disclosure.Header>

        <Disclosure.Body>
          <P>{description}</P>

          {addonElement}
        </Disclosure.Body>

        <Disclosure.Footer>
          <BackButton disabled={loading} />

          <Btn
            onClick={onConfirm}
            loading={loading}
            colorPalette={themeConfig.colorPalette}
            {...confirmButtonProps}
          >
            {confirmLabel}
          </Btn>
        </Disclosure.Footer>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};

interface ConfirmationTriggerProps extends StackProps {
  children?: any;

  /** Unique identifier used internally to control the disclosure instance */
  id: string;

  /** Title displayed in the confirmation header */
  title: string;

  /** Description message explaining the action that requires confirmation */
  description: string;

  /** Label displayed on the confirm action button */
  confirmLabel: any;

  /** Callback executed when the confirm button is pressed */
  onConfirm: () => void;

  /** Additional props forwarded to the confirm button */
  confirmButtonProps?: BtnProps;

  /** Shows loading state on the confirm button and disables actions */
  loading?: boolean;

  /** Disables the trigger interaction */
  disabled?: any;

  /** Optional element rendered inside the confirmation body (e.g. warning, extra info, form field) */
  addonElement?: any;

  /** Optional callback executed before the disclosure is opened */
  onClick?: () => void;
}
const ConfirmationTrigger = (props: ConfirmationTriggerProps) => {
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

      <ConfirmationContent
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

export const Confirmation = {
  /**
   * Trigger element that opens the confirmation disclosure (dialog/drawer based on vieport).
   *
   * The children act as the clickable element.
   * When clicked, a confirmation disclosure will appear.
   */
  Trigger: ConfirmationTrigger,
};
