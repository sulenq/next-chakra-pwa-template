"use client";

import { Text, TextProps } from "@chakra-ui/react";
import parse, { domToReact } from "html-react-parser";
import { forwardRef } from "react";

interface Props extends TextProps {
  children?: any;
}

export const P = forwardRef<HTMLParagraphElement, Props>((props, ref) => {
  // Props
  const { children = "", ...restProps } = props;

  return (
    <Text ref={ref} as="p" wordBreak={"break-word"} {...restProps}>
      {typeof children === "string"
        ? parse(children, {
            replace: (domNode) => {
              if (
                domNode.type === "tag" &&
                domNode.name === "b" &&
                domNode.children.length
              ) {
                return (
                  <b style={{ fontWeight: 700 }}>
                    {domToReact(domNode.children as any)}
                  </b>
                );
              }
            },
          })
        : "Invalid string"}
    </Text>
  );
});

P.displayName = "P";
