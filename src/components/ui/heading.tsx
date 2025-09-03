import { Heading, HeadingProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const H1 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Heading ref={ref} as="h1" fontSize="48px" {...restProps}>
      {children}
    </Heading>
  );
});
H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <Heading ref={ref} as="h2" fontSize="36px" {...restProps}>
      {children}
    </Heading>
  );
});
H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <Heading ref={ref} as="h3" fontSize="28px" {...restProps}>
      {children}
    </Heading>
  );
});
H3.displayName = "H3";

export const H4 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <Heading ref={ref} as="h4" fontSize="22px" {...restProps}>
      {children}
    </Heading>
  );
});
H4.displayName = "H4";

export const H5 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <Heading ref={ref} as="h5" fontSize="18px" {...restProps}>
      {children}
    </Heading>
  );
});
H5.displayName = "H5";

export const H6 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <Heading ref={ref} as="h6" fontSize="15px" {...restProps}>
      {children}
    </Heading>
  );
});
H6.displayName = "H6";
