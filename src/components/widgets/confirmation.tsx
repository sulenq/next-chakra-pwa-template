import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Disclosure } from "@/components/ui/disclosure";
import { P } from "@/components/ui/p";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { Box, StackProps } from "@chakra-ui/react";
import { BackButton } from "@/components/widgets/back-button";
import { useCountdown } from "@/hooks/useCountdown";
import { useEffect } from "react";
import { Tooltip } from "@/components/ui/tooltip";

// -----------------------------------------------------------------

interface ConfirmationProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmButtonProps?: BtnProps;
  confirmCountdown?: string;
  isCountdownFinished?: boolean;
  loading?: boolean;
  addonElement?: any;
  onConfirm: () => void;
}

const ConfirmationContent = (props: ConfirmationProps) => {
  // Props
  const {
    open,
    title,
    description,
    confirmLabel,
    confirmCountdown,
    isCountdownFinished,
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

          <Box w={["full", null, "fit"]} pos={"relative"}>
            <Btn
              w={"full"}
              loading={loading}
              colorPalette={themeConfig.colorPalette}
              fontVariantNumeric={"tabular-nums"}
              disabled={!isCountdownFinished}
              onClick={onConfirm}
              {...confirmButtonProps}
            >
              <Tooltip content={confirmLabel}>
                <P lineClamp={1} opacity={isCountdownFinished ? 1 : 0.25}>
                  {confirmLabel}
                </P>
              </Tooltip>
            </Btn>

            <P
              pos={"absolute"}
              top={"50%"}
              left={"50%"}
              transform={"translate(-50%, -50%)"}
              fontVariantNumeric={"tabular-nums"}
              pointerEvents={"none"}
              opacity={isCountdownFinished ? 0 : 1}
              lineClamp={1}
            >
              {`${confirmCountdown}`}
            </P>
          </Box>
        </Disclosure.Footer>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};

// -----------------------------------------------------------------

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

  /** Number of seconds to wait before executing the confirmation action */
  confirmCountdownDuration?: number;

  /** Additional props forwarded to the confirm button */
  confirmButtonProps?: BtnProps;

  /** Shows loading state on the confirm button and disables actions */
  loading?: boolean;

  /** Disables the trigger interaction */
  disabled?: any;

  /** Optional element rendered inside the confirmation body (e.g. warning, extra info, form field) */
  addonElement?: any;

  /** Callback executed when the confirm button is pressed */
  onConfirm: () => void;

  /** Optional callback executed before the disclosure is opened */
  onOpen?: () => void;
}

export const ConfirmationTrigger = (props: ConfirmationTriggerProps) => {
  // Props
  const {
    children,
    id,
    title,
    description,
    confirmLabel,
    confirmCountdownDuration = 0,
    confirmButtonProps,
    loading,
    disabled,
    addonElement,
    onConfirm,
    onOpen,
    ...restProps
  } = props;

  // Hooks
  const { open, onOpen: openDisclosure } = usePopDisclosure(
    disclosureId(`${id}`),
  );
  const {
    formattedCountdown,
    startCountdown,
    stopCountdown,
    resetCountdown,
    isCountdownFinished,
  } = useCountdown({
    duration: confirmCountdownDuration,
  });

  useEffect(() => {
    if (open) {
      onOpen?.();

      if (confirmCountdownDuration) {
        startCountdown();
      }
    } else {
      if (confirmCountdownDuration) {
        stopCountdown();
        resetCountdown();
      }
    }
  }, [open]);

  return (
    <>
      <CContainer
        w={"fit"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (disabled) return;

          openDisclosure();
          onOpen?.();
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
        confirmCountdown={`${formattedCountdown}s`}
        isCountdownFinished={isCountdownFinished}
        onConfirm={onConfirm}
        confirmButtonProps={confirmButtonProps}
        loading={loading}
        addonElement={addonElement}
      />
    </>
  );
};

// -----------------------------------------------------------------

export const Confirmation = {
  /**
   * Trigger element that opens the confirmation disclosure (dialog/drawer based on vieport).
   *
   * The children act as the clickable element.
   * When clicked, a confirmation disclosure will appear.
   */
  Trigger: ConfirmationTrigger,
};
