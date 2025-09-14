"use client";

import { Props__StringInput } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import {
  Box,
  Center,
  Input as ChakraInput,
  Icon,
  IconButton,
  useFieldContext,
} from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
import { forwardRef, useRef } from "react";
import { useColorMode } from "./color-mode";
import { IconX } from "@tabler/icons-react";

export const StringInput = forwardRef<HTMLInputElement, Props__StringInput>(
  (props, ref) => {
    // Props
    const {
      name,
      onChange,
      inputValue,
      placeholder = "Input text",
      boxProps,
      invalid,
      clearable = true,
      clearButtonProps,
      ...restProps
    } = props;

    // Contexts
    const { colorMode } = useColorMode();
    const { themeConfig } = useThemeConfig();
    const fc = useFieldContext();

    // Refs
    const isFirstRender = useRef(true);

    // States
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
      if (onChange) {
        onChange(e.target.value);
      }
      if (isFirstRender.current) isFirstRender.current = false;
    };

    return (
      <>
        <Global styles={styles} />

        <Box
          position={"relative"}
          w={"full"}
          overflow={"visible"}
          {...boxProps}
        >
          <ChakraInput
            ref={ref}
            name={name}
            onChange={handleChange}
            value={inputValue}
            _placeholder={{
              fontSize: "md",
            }}
            placeholder={placeholder}
            borderColor={
              invalid ?? fc?.invalid ? "border.error" : "border.muted"
            }
            fontWeight={"medium"}
            outline={"none !important"}
            _focus={{ borderColor: themeConfig.primaryColor }}
            rounded={themeConfig.radii.component}
            autoComplete="off"
            transition={"200ms"}
            color={"text"}
            pl={4}
            pr={clearable ? 10 : ""}
            {...restProps}
          />

          {inputValue && clearable && (
            <Center
              flexShrink={0}
              zIndex={2}
              position={"absolute"}
              h={"full"}
              right={1}
              top={0}
              {...clearButtonProps}
            >
              <IconButton
                aria-label="clear input"
                onClick={() => {
                  onChange?.("");
                }}
                variant={"plain"}
                size={"sm"}
                color={"fg.subtle"}
              >
                <Icon boxSize={"18px"}>
                  <IconX />
                </Icon>
              </IconButton>
            </Center>
          )}
        </Box>
      </>
    );
  }
);

StringInput.displayName = "StringInput";
