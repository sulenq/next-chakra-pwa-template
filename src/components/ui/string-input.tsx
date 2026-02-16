"use client";

import { CContainer } from "@/components/ui/c-container";
import { toaster } from "@/components/ui/toaster";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__StringInput } from "@/constants/props";
import { BASE_ICON_BOX_SIZE, MAIN_INPUT_SIZE } from "@/constants/styles";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useMergedRefs } from "@/hooks/useMergeRefs";
import { interpolateString } from "@/utils/string";
import {
  Center,
  Input as ChakraInput,
  Icon,
  IconButton,
  useFieldContext,
} from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
import { XIcon } from "lucide-react";
import { forwardRef, useRef } from "react";
import { useColorMode } from "./color-mode";

export const StringInput = forwardRef<HTMLInputElement, Props__StringInput>(
  (props, ref) => {
    // Props
    const {
      name,
      onChange,
      inputValue,
      placeholder = "Input text",
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
    const { l } = useLang();
    const { colorMode } = useColorMode();
    const { themeConfig } = useThemeConfig();
    const fc = useFieldContext();

    // Refs
    const isFirstRender = useRef(true);
    const localInputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, localInputRef);

    // States
    const resolvedInvalid = invalid || fc?.invalid;
    const disabled = fc?.disabled;

    // Styles
    const darkLightColorManual = colorMode === "light" ? "#fff" : "var(--dark)";
    const styles = css`
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px ${darkLightColorManual} inset !important;
        box-shadow: 0 0 0 30px ${darkLightColorManual} inset !important;
      }
    `;

    // Utils
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Handle maxChar limitation
      if (maxChar !== null && value.length > maxChar) {
        value = value.slice(0, maxChar);
        toaster.create({
          title: l.info_max_char_reached.title,
          description: interpolateString(l.info_max_char_reached.description, {
            maxChar: maxChar,
          }),
        });
      }

      onChange?.(value);
      if (isFirstRender.current) isFirstRender.current = false;
    };

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
            ref={mergedRef}
            name={name}
            onChange={handleChange}
            value={inputValue}
            bg={variant === "subtle" ? "d0" : ""}
            _placeholder={{ fontSize: "md" }}
            placeholder={placeholder}
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
            _focus={{ borderColor: themeConfig.primaryColor }}
            rounded={themeConfig.radii.component}
            autoComplete="off"
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
                aria-label="clear input"
                onClick={() => {
                  onChange?.("");
                  localInputRef.current?.focus(); // back to input after clear
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

StringInput.displayName = "StringInput";
