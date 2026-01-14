import { Props__TextareaInput } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Textarea as ChakraTextarea, useFieldContext } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import useLang from "@/context/useLang";
import { interpolateString } from "@/utils/string";
import { forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, Props__TextareaInput>(
  (props, ref) => {
    // Props
    const {
      name,
      onChange,
      inputValue,
      invalid,
      placeholder = "Input text",
      maxChar = null,
      variant = "outline",
      ...restProps
    } = props;

    // Contexts
    const { l } = useLang();
    const { themeConfig } = useThemeConfig();
    const fc = useFieldContext();

    // States
    const resolvedInvalid = invalid || fc?.invalid;

    // Utils
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    };

    return (
      <ChakraTextarea
        ref={ref}
        name={name}
        borderColor={
          resolvedInvalid
            ? "border.error"
            : variant === "subtle"
            ? "transparent"
            : "border.muted"
        }
        bg={variant === "subtle" ? "d0" : ""}
        fontSize={"md"}
        fontWeight={"medium"}
        outline={"none !important"}
        _placeholder={{
          fontSize: "md",
        }}
        _focus={{ borderColor: themeConfig.primaryColor }}
        rounded={themeConfig.radii.component}
        placeholder={placeholder}
        onChange={handleChange}
        px={4}
        value={inputValue}
        autoresize
        variant={variant as any}
        spellCheck={false}
        {...restProps}
      />
    );
  }
);

Textarea.displayName = "Textarea";
