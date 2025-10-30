import { Props__TextareaInput } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Textarea as ChakraTextarea, useFieldContext } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import useLang from "@/context/useLang";
import { interpolateString } from "@/utils/string";

export const Textarea = (props: Props__TextareaInput) => {
  // Props
  const {
    name,
    onChange,
    inputValue,
    invalid,
    placeholder = "Input text",
    maxChar = null,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();
  const { l } = useLang();

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
      name={name}
      borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
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
      {...restProps}
    />
  );
};

Textarea.displayName = "Textarea";
