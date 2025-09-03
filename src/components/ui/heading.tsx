import { Heading, HeadingProps } from "@chakra-ui/react";

export const H1 = (props: HeadingProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Heading as={"h1"} {...restProps}>
      {children}
    </Heading>
  );
};
