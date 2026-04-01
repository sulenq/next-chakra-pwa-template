import { P } from "@/components/ui/p";
import { useLocale } from "@/contexts/useLocale";
import {
  Badge,
  Field as ChakraField,
  FieldsetRoot as ChakraFieldsetRoot,
  FieldsetRootProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  labelProps?: ChakraField.LabelProps;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  optional?: boolean;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    // Props
    const {
      label,
      labelProps,
      children,
      helperText,
      errorText,
      optionalText,
      optional,
      ...rest
    } = props;

    // Contexts
    // const { themeConfig } = useThemeConfig();

    // Hooks
    const { t } = useLocale();

    return (
      <ChakraField.Root ref={ref} gap={2} {...rest}>
        {label && (
          <ChakraField.Label fontSize={"md"} {...labelProps}>
            <P
              fontWeight={"medium"}
              // px={`calc(${themeConfig.radii.component} - 4px)`}
            >
              {label}
            </P>

            {optional && (
              <Badge colorPalette={"gray"} color={"fg.muted"}>
                {t.optional.toLocaleLowerCase()}
              </Badge>
            )}
            <ChakraField.RequiredIndicator fallback={optionalText} />
          </ChakraField.Label>
        )}
        {children}
        {helperText && (
          <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
        )}
        {errorText && (
          <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    );
  },
);

// -----------------------------------------------------------------

export const FieldsetRoot = forwardRef<any, FieldsetRootProps>(
  function FieldsetRoot(props, ref) {
    return (
      <ChakraFieldsetRoot ref={ref} {...props}>
        {props.children}
      </ChakraFieldsetRoot>
    );
  },
);
