import { Props__StringInput } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import {
  Box,
  Input as ChakraInput,
  useFieldContext
} from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
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
      boxProps,
      invalid,
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

    // Utils
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
      if (isFirstRender.current) isFirstRender.current = false;
    };

    return (
      <>
        <Global
          styles={css`
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px ${darkLightColorManual} inset !important;
              box-shadow: 0 0 0 30px ${darkLightColorManual} inset !important;
            }
          `}
        />

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
            placeholder={placeholder}
            borderColor={
              invalid ?? fc?.invalid ? "border.error" : "border.muted"
            }
            fontWeight={"medium"}
            outline={"none !important"}
            _focus={{ borderColor: themeConfig.primaryColor }}
            borderRadius={themeConfig.radii.component}
            autoComplete="off"
            transition={"200ms"}
            color={"text"}
            {...restProps}
          />
        </Box>
      </>
    );
  }
);

StringInput.displayName = "StringInput";
