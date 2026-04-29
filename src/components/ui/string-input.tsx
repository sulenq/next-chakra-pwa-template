"use client";

import { CContainer } from "@/components/ui/c-container";
import { useColorMode } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import { LucideIcon } from "@/components/widgets/icon";
import { BASE_ICON_BOX_SIZE, MAIN_INPUT_SIZE } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useMergedRefs } from "@/hooks/useMergeRefs";
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
import { forwardRef, useRef } from "react";

// -----------------------------------------------------------------

export interface StringInputProps extends Omit<InputProps, "onChange"> {
  inputValue?: string;
  onChange?: (inputValue: string) => void;
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
      inputValue,
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

    // Contexts
    const { t } = useLocale();
    const { themeConfig } = useThemeConfig();
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
    const isColorPaletteGray = themeConfig.colorPalette === "gray";

    // Utils
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Handle maxChar limitation
      if (maxChar !== null && value.length > maxChar) {
        value = value.slice(0, maxChar);
        toaster.create({
          title: t.info_max_char_reached.title,
          description: interpolateString(t.info_max_char_reached.description, {
            maxChar: maxChar,
          }),
        });
      }

      onChange?.(value);
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

        <CContainer
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
            value={inputValue}
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
            fontWeight={"medium"}
            outline={"none !important"}
            _focus={{
              borderColor: isColorPaletteGray
                ? "ibody"
                : themeConfig.primaryColor,
            }}
            rounded={themeConfig.radii.component}
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

          {inputValue && clearable && !disabled && (
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
                  onChange?.("");
                  inputRef.current?.focus(); // back to input after clear
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
        </CContainer>
      </>
    );
  },
);
