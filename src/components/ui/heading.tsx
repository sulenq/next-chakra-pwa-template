import { Heading, HeadingProps } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export const H1 = forwardRef<HTMLHeadingElement, HeadingProps>(
  function H1(props, ref) {
    const { children, ...restProps } = props;

    return (
      <Heading ref={ref} as={"h1"} fontSize={"3rem"} {...restProps}>
        {children}
      </Heading>
    );
  },
);

// -----------------------------------------------------------------

export const H2 = forwardRef<HTMLHeadingElement, HeadingProps>(
  function H2(props, ref) {
    const { children, ...restProps } = props;

    return (
      <Heading ref={ref} as={"h2"} fontSize={"2.25rem"} {...restProps}>
        {children}
      </Heading>
    );
  },
);

// -----------------------------------------------------------------

export const H3 = forwardRef<HTMLHeadingElement, HeadingProps>(
  function H3(props, ref) {
    const { children, ...restProps } = props;

    return (
      <Heading ref={ref} as={"h3"} fontSize={"1.75rem"} {...restProps}>
        {children}
      </Heading>
    );
  },
);

// -----------------------------------------------------------------

export const H4 = forwardRef<HTMLHeadingElement, HeadingProps>(
  function H4(props, ref) {
    const { children, ...restProps } = props;

    return (
      <Heading ref={ref} as={"h4"} fontSize={"1.375rem"} {...restProps}>
        {children}
      </Heading>
    );
  },
);

// -----------------------------------------------------------------

export const H5 = forwardRef<HTMLHeadingElement, HeadingProps>(
  function H5(props, ref) {
    const { children, ...restProps } = props;

    return (
      <Heading ref={ref} as={"h5"} fontSize={"1.125rem"} {...restProps}>
        {children}
      </Heading>
    );
  },
);

// -----------------------------------------------------------------

export const H6 = forwardRef<HTMLHeadingElement, HeadingProps>(
  function H6(props, ref) {
    const { children, ...restProps } = props;

    return (
      <Heading ref={ref} as={"h6"} fontSize={"0.9375rem"} {...restProps}>
        {children}
      </Heading>
    );
  },
);
