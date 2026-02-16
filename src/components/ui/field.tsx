import useLang from "@/context/useLang";
import {
  Badge,
  Field as ChakraField,
  FieldsetRootProps,
  FieldsetRoot as ChakraFieldsetRoot,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export interface Props__Field extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  labelProps?: ChakraField.LabelProps;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  optional?: boolean;
}
export const Field = forwardRef<HTMLDivElement, Props__Field>(function Field(
  props,
  ref
) {
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

  // Hooks
  const { l } = useLang();

  return (
    <ChakraField.Root ref={ref} gap={2} {...rest}>
      {label && (
        <ChakraField.Label fontSize={"md"} {...labelProps}>
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

export interface Props__FieldsetRoot extends FieldsetRootProps {}
export const FieldsetRoot = forwardRef<any, Props__FieldsetRoot>(
  function FieldsetRoot(props, ref) {
    return (
      <ChakraFieldsetRoot ref={ref} {...props}>
        {props.children}
      </ChakraFieldsetRoot>
    );
  }
);
