import { toaster } from "@/components/ui/toaster";
import { InputVariant } from "@/shared/constants/types";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { interpolateString } from "@/shared/utils/string";
import {
  Textarea as ChakraTextarea,
  TextareaProps,
  useFieldContext,
} from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface TextareaInputProps extends Omit<TextareaProps, "onChange"> {
  inputValue?: string;
  onChange?: (inputValue: string) => void;
  invalid?: boolean;
  placeholder?: string;
  maxChar?: number;
  variant?: InputVariant;
}

export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaInputProps
>(function TextareaInput(props, ref) {
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Props
  const {
    name,
    onChange,
    inputValue,
    invalid,
    placeholder = t.text_input,
    maxChar = null,
    variant = "outline",
    ...restProps
  } = props;

  // Contexts
  const fc = useFieldContext();

  // Derived Values
  const resolvedInvalid = invalid || fc?.invalid;

  // Utils
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      variant={variant}
      spellCheck={false}
      {...restProps}
    />
  );
});
