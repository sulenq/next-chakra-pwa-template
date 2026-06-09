import { toaster } from "@/components/ui/toaster";
import { InputVariant } from "@/types/global.types";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { interpolateString } from "@/utils/string";
import {
  Textarea as ChakraTextarea,
  TextareaProps,
  useFieldContext,
} from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface TextareaInputProps extends Omit<TextareaProps, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  placeholder?: string;
  maxChar?: number;
  variant?: InputVariant;
}

export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaInputProps
>(function TextareaInput(props, ref) {
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Props
  const {
    name,
    onChange,
    value,
    invalid,
    placeholder = t.text_input,
    maxChar = null,
    variant = "outline",
    ...restProps
  } = props;

  // Stores
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
      outline={"none !important"}
      _placeholder={{
        fontSize: "md",
      }}
      _focus={{ borderColor: theme.primaryColor }}
      rounded={theme.radii.component}
      placeholder={placeholder}
      onChange={handleChange}
      px={4}
      value={value}
      autoresize
      variant={variant}
      spellCheck={false}
      {...restProps}
    />
  );
});
