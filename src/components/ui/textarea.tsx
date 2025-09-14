import { Props__TextareaInput } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Textarea as ChakraTextarea, useFieldContext } from "@chakra-ui/react";

export const Textarea = (props: Props__TextareaInput) => {
  // Props
  const { name, onChange, inputValue, invalid, placeholder, ...restProps } =
    props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  return (
    <ChakraTextarea
      name={name}
      borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
      fontWeight={"medium"}
      outline={"none !important"}
      _placeholder={{
        fontSize: "md",
      }}
      _focus={{ borderColor: themeConfig.primaryColor }}
      rounded={themeConfig.radii.component}
      placeholder={placeholder || "Input text"}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      px={4}
      value={inputValue}
      autoresize
      {...restProps}
    />
  );
};
