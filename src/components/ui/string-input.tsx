"use client";

import { useColorMode } from "@/components/ui/color-mode";
import { StackV } from "@/components/ui/stack";
import { toaster } from "@/components/ui/toaster";
import { LucideIcon } from "@/components/misc/icon";
import { BASE_ICON_BOX_SIZE, MAIN_INPUT_SIZE } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useMergedRefs } from "@/hooks/use-merge-refs";
import { interpolateString } from "@/utils/string";
import {
  Center,
  Input as ChakraInput,
  Icon,
  IconButton,
  InputProps,
  StackProps,
  useFieldContext,
} from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
import { XIcon } from "lucide-react";
import { forwardRef, useRef, useState } from "react";

// -----------------------------------------------------------------

export interface StringInputProps extends InputProps {
  placeholder?: string;
  containerProps?: StackProps;
  invalid?: boolean;
  clearable?: boolean;
  clearButtonProps?: StackProps;
  maxChar?: number;
}

export const StringInput = forwardRef<HTMLInputElement, StringInputProps>(
  function StringInput(props, ref) {
    // Props
    const {
      name,
      onChange,
      placeholder,
      containerProps,
      invalid,
      clearable = true,
      clearButtonProps,
      flex,
      flexShrink,
      flexGrow,
      flexBasis,
      maxChar = null,
      variant = "outline",
      ...restProps
    } = props;

    // Stores
    const { t } = useLocaleStore();
    const { theme } = useThemeStore();
    const fc = useFieldContext();

    // Refs
    const isFirstRender = useRef(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergeRef = useMergedRefs(inputRef, ref);

    // Hooks
    const { colorMode } = useColorMode();

    // Constants
    const disabled = fc?.disabled;

    // Derived Values
    const resolvedPlaceholder = placeholder ?? t.text_input;
    const resolvedInvalid = invalid || fc?.invalid;
    const isColorPaletteGray = theme.colorPalette === "gray";

    const [hasValue, setHasValue] = useState(
      () => !!(props.value || props.defaultValue),
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const targetValue = e.target.value;

      if (maxChar !== null && targetValue.length > maxChar) {
        e.target.value = targetValue.slice(0, maxChar);
        toaster.create({
          title: t.info_max_char_reached.title,
          description: interpolateString(t.info_max_char_reached.description, {
            maxChar: maxChar,
          }),
        });
      }

      setHasValue(!!e.target.value);
      onChange?.(e);
      if (isFirstRender.current) isFirstRender.current = false;
    };

    // SX
    const color =
      colorMode === "light"
        ? "var(--chakra-colors-light)"
        : "var(--chakra-colors-dark)";
    const styles = css`
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px ${color} inset !important;
        box-shadow: 0 0 0 30px ${color} inset !important;
      }
    `;

    return (
      <>
        <Global styles={styles} />

        <StackV
          position={"relative"}
          w={restProps?.w || "full"}
          h={restProps?.h}
          flex={flex}
          flexShrink={flexShrink}
          flexGrow={flexGrow}
          flexBasis={flexBasis}
          display={"inline-flex"}
          overflow={"visible"}
          {...containerProps}
        >
          <ChakraInput
            ref={mergeRef}
            name={name}
            onChange={handleChange}
            bg={variant === "subtle" ? "d0" : ""}
            _placeholder={{ fontSize: "md" }}
            placeholder={resolvedPlaceholder}
            borderColor={
              resolvedInvalid
                ? "border.error"
                : variant === "subtle"
                  ? "transparent"
                  : "border.muted"
            }
            fontSize={"md"}
            outline={"none !important"}
            _focus={{
              borderColor: isColorPaletteGray ? "ibody" : theme.primaryColor,
            }}
            rounded={theme.radii.component}
            autoComplete={"off"}
            transition={"200ms"}
            color={"text"}
            pl={4}
            pr={clearable ? 10 : ""}
            size={MAIN_INPUT_SIZE}
            variant={variant}
            spellCheck={false}
            {...restProps}
          />

          {hasValue && clearable && !disabled && (
            <Center
              flexShrink={0}
              zIndex={2}
              position={"absolute"}
              h={"full"}
              right={"2px"}
              top={0}
              {...clearButtonProps}
            >
              <IconButton
                aria-label={"clear input"}
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = "";
                    setHasValue(false);
                    inputRef.current.focus();

                    const event = {
                      target: inputRef.current,
                      currentTarget: inputRef.current,
                    } as React.ChangeEvent<HTMLInputElement>;

                    onChange?.(event);
                  }
                }}
                variant={"plain"}
                size={"sm"}
                color={"fg.subtle"}
              >
                <Icon boxSize={BASE_ICON_BOX_SIZE}>
                  <LucideIcon icon={XIcon} />
                </Icon>
              </IconButton>
            </Center>
          )}
        </StackV>
      </>
    );
  },
);
