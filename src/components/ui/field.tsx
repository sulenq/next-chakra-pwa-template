import useLang from "@/context/useLang";
import { Badge, Field as ChakraField } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  optional?: boolean;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  props,
  ref
) {
  const {
    label,
    children,
    helperText,
    errorText,
    optionalText,
    optional,
    ...rest
  } = props;

  // Hooks
  const { l } = useLang();

  return (
    <ChakraField.Root ref={ref} gap={2} {...rest}>
      {label && (
        <ChakraField.Label fontSize={"md"}>
          {label}
          {optional && (
            <Badge colorScheme="gray" color={"fg.muted"}>
              {l.optional.toLocaleLowerCase()}
            </Badge>
          )}
          <ChakraField.RequiredIndicator fallback={optionalText} />
        </ChakraField.Label>
      )}
      {children}
      {helperText && (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      )}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  );
});
